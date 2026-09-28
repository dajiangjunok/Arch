import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
let userId: string;
let distributorId: string;
let discountCode: string;
const details = { name: "Test applicant", email: "applicant@example.test", selectedTicket: "single_week", selectedWeeks: ["week_1"], alternateContact: "Test contact", message: "Test application", additionalInfo: "" };

before(async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql as 'select null::uuid';`);
  for (const name of (await readdir("supabase/migrations")).filter((name) => name.endsWith(".sql")).sort()) {
    await db.exec(await readFile(`supabase/migrations/${name}`, "utf8"));
  }
});
after(async () => { await db.close(); });
beforeEach(async () => {
  await db.exec("truncate auth.users cascade");
  userId = randomUUID(); distributorId = randomUUID();
  await db.query("insert into auth.users values ($1)", [userId]);
  await db.query("insert into distributors(id, user_id, name) values ($1,$2,'Test partner')", [distributorId, userId]);
  await db.query("insert into referral_codes(id, code, distributor_id) values ($1,'INVITE-TEST',$2)", [randomUUID(), distributorId]);
  await toggle(true);
  discountCode = (await db.query<{code: string}>("select code from referral_codes where kind='discount'")).rows[0].code;
});
async function toggle(enabled: boolean) { await db.query("select set_distributor_discount($1,$2)", [distributorId, enabled]); }
async function submit(code = discountCode, overrides = {}, coupon: string | null = "coupon_fixed") {
  return (await db.query<Record<string, any>>("select * from submit_application($1,$2,$3,$4)", [userId, { ...details, ...overrides }, code, coupon])).rows[0];
}
async function editInviter(applicationId: string, invitedBy: string, editorId = userId) {
  return (await db.query<Record<string, any>>(
    "select * from update_unpaid_application($1,$2,$3,$4,$5,$6,$7,$8)",
    [applicationId, editorId, details.name, details.email, details.alternateContact, details.message, details.additionalInfo, invitedBy],
  )).rows;
}
async function adminEditInviter(applicationId: string, invitedBy: string, email: string | null = "admin@example.test") {
  return (await db.query<Record<string, any>>(
    "select * from admin_update_application_invited_by($1,$2,$3,$4)",
    [applicationId, invitedBy, userId, email],
  )).rows[0];
}
async function orderFor(applicationId: string, amount = 979900) {
  await db.query("update applications set status='approved' where id=$1", [applicationId]);
  const order = (await db.query<Record<string, any>>("select * from create_application_order($1,$2,'usd')", [applicationId, amount])).rows[0];
  await db.query("update orders set stripe_checkout_session_id=$2, status='checkout_created' where id=$1", [order.id, `cs_${order.id}`]);
  return order;
}
async function pay(orderId: string, amount = 850000, currency = "usd", status = "paid", sessionId = `cs_${orderId}`) {
  await db.query("select mark_order_paid($1,$2,'cus_test',$3,$4,$5)", [orderId, `pi_${orderId}`, amount, currency, { data: { object: { id: sessionId, payment_status: status } } }]);
}
async function commission() {
  return Number((await db.query<{total: string}>("select coalesce(sum(commission_amount),0) as total from commissions where status <> 'reversed'")).rows[0].total);
}
async function paidTierCount() {
  return Number((await db.query<{paid_referral_count: number}>("select paid_referral_count from list_distributor_paid_referral_counts() where distributor_id=$1", [distributorId])).rows[0].paid_referral_count);
}
async function fellowshipOrder(ticket = "fellowship_single_week", amount = 150000, weeks = ["week_1"]) {
  return orderFor((await submit("INVITE-TEST", { selectedTicket: ticket, selectedWeeks: weeks }, null)).id, amount);
}
async function modelCommission(model: "tiered" | "fellowship") {
  return Number((await db.query<{total: string}>("select coalesce(sum(commission_amount),0) as total from commissions where status <> 'reversed' and commission_model=$1", [model])).rows[0].total);
}

test("ordinary invites and no-code applications retain full-price behavior", async () => {
  const ordinary = await submit("invite-test", {}, null);
  assert.equal(ordinary.discount_amount, 0);
  assert.equal(ordinary.discount_code, null);
  assert.ok(ordinary.distributor_id);
  const uninvited = await submit("", {}, null);
  assert.equal(uninvited.referral_id, null);
  const order = await orderFor(ordinary.id);
  assert.equal(order.amount, 979900);
  await pay(order.id, 979900);
  assert.equal(await commission(), 88191);
});

test("inviter names distinguish sources under one distributor for invite and discount codes", async () => {
  for (const [code, name] of [["INVITE-TEST", "  ABC Community / 김민수  "], [discountCode, "  张三 / Partner B  "]]) {
    const application = await submit(code, { invitedBy: name });
    assert.equal(application.invited_by, name.trim());
    assert.equal(application.distributor_id, distributorId);
    const referral = (await db.query<{ distributor_id: string; code_snapshot: string }>(
      "select distributor_id, code_snapshot from referrals where id=$1", [application.referral_id],
    )).rows[0];
    assert.equal(referral.distributor_id, distributorId);
    assert.equal(referral.code_snapshot, code);
    const saved = (await db.query<{ invited_by: string }>("select invited_by from applications where id=$1", [application.id])).rows[0];
    assert.equal(saved.invited_by, name.trim());
    const order = await orderFor(application.id);
    await pay(order.id, code === discountCode ? 850000 : 979900);
  }
  assert.equal(await commission(), Math.floor((979900 + 850000) * 0.09));
});

test("invited by is optional for every application and whitespace is stored as null", async () => {
  for (const code of ["", "INVITE-TEST", discountCode]) {
    for (const overrides of [{}, { invitedBy: "" }, { invitedBy: "   " }, { invitedBy: null }]) {
      const application = await submit(code, overrides);
      assert.equal(application.invited_by, null);
    }
  }
});

test("direct applications discard inviter data and cannot acquire attribution from a name", async () => {
  for (const code of ["", "   "]) {
    const application = await submit(code, { invitedBy: "ABC Community", distributorId });
    assert.equal(application.invited_by, null);
    assert.equal(application.distributor_id, null);
    assert.equal(application.referral_id, null);
    await assert.rejects(db.query("update applications set invited_by='ABC Community' where id=$1", [application.id]), /applications_invited_by_check/);
  }
  assert.equal((await db.query("select * from referrals")).rows.length, 0);
});

test("invalid referrals and oversized inviter names leave no applications or referrals", async () => {
  await assert.rejects(submit("INVALID", { invitedBy: "ABC Community" }), /no longer available/);
  for (const code of ["INVITE-TEST", discountCode]) {
    await assert.rejects(submit(code, { invitedBy: "가".repeat(201) }), /200 characters or fewer/);
  }
  assert.equal((await db.query("select * from applications")).rows.length, 0);
  assert.equal((await db.query("select * from referrals")).rows.length, 0);
  assert.equal((await db.query<{ count: number }>("select sum(used_count)::int as count from referral_codes")).rows[0].count, 0);
  assert.equal((await submit("INVITE-TEST", { invitedBy: "가".repeat(200) })).invited_by, "가".repeat(200));
});

test("editing contact details preserves the inviter recorded on the application", async () => {
  const application = await submit("INVITE-TEST", { invitedBy: "ABC Community" });
  const edited = (await db.query<{ invited_by: string; name: string; distributor_id: string }>(
    "select * from update_unpaid_application($1,$2,$3,$4,$5,$6,$7)",
    [application.id, userId, "Updated name", details.email, details.alternateContact, details.message, "Updated notes"],
  )).rows[0];
  assert.equal(edited.name, "Updated name");
  assert.equal(edited.invited_by, "ABC Community");
  assert.equal(edited.distributor_id, distributorId);
});

test("applicants can add, correct and clear their inviter without changing referral or pricing", async () => {
  for (const code of ["INVITE-TEST", discountCode]) {
    const original = await submit(code);
    for (const value of ["  ABC Community / 김민수  ", "张三 / Partner B", "가".repeat(200), "   "]) {
      const [edited] = await editInviter(original.id, value);
      assert.equal(edited.invited_by, value.trim() || null);
      const { invited_by, updated_at, ...savedFields } = edited;
      const { invited_by: originalInviter, updated_at: originalUpdated, ...originalFields } = original;
      assert.deepEqual(savedFields, originalFields);
    }
  }
});

test("editing cannot add inviter information to direct applications or exceed the length limit", async () => {
  const direct = await submit("", {}, null);
  const [edited] = await editInviter(direct.id, "ABC Community");
  assert.equal(edited.invited_by, null);
  assert.equal(edited.distributor_id, null);
  assert.equal(edited.referral_id, null);
  const referred = await submit("INVITE-TEST", { invitedBy: "Original" });
  await assert.rejects(editInviter(referred.id, "가".repeat(201)), /200 characters or fewer/);
  assert.equal((await db.query<{ invited_by: string }>("select invited_by from applications where id=$1", [referred.id])).rows[0].invited_by, "Original");
});

test("applicants cannot edit another user's inviter or a closed application", async () => {
  const application = await submit("INVITE-TEST", { invitedBy: "Original" });
  assert.deepEqual(await editInviter(application.id, "Changed", randomUUID()), []);
  for (const status of ["paid", "rejected", "canceled"]) {
    await db.query("update applications set status=$2 where id=$1", [application.id, status]);
    assert.deepEqual(await editInviter(application.id, "Changed"), []);
  }
  assert.equal((await db.query<{ invited_by: string }>("select invited_by from applications where id=$1", [application.id])).rows[0].invited_by, "Original");
});

test("applications remain editable in review and interview states", async () => {
  const application = await submit("INVITE-TEST");
  for (const status of ["pending_review", "interview_invited", "interview_scheduled", "more_info_required"]) {
    await db.query("update applications set status=$2 where id=$1", [application.id, status]);
    const [edited] = await editInviter(application.id, `Inviter for ${status}`);
    assert.equal(edited.invited_by, `Inviter for ${status}`);
    assert.equal(edited.status, status);
  }
});

test("approval locks all applicant fields before checkout and after unpaid checkout changes", async () => {
  const application = await submit("INVITE-TEST", { invitedBy: "Original" });
  let order: Record<string, any> | undefined;
  for (const orderStatus of [null, "pending", "checkout_created", "payment_failed", "expired", "canceled"]) {
    if (orderStatus) {
      order ??= await orderFor(application.id);
      await db.query("update orders set status=$2 where id=$1", [order.id, orderStatus]);
    }
    for (const status of ["approved", "payment_sent"]) {
      await db.query("update applications set status=$2 where id=$1", [application.id, status]);
      const before = (await db.query("select * from applications where id=$1", [application.id])).rows[0];
      for (const includeInviter of [false, true]) {
        const args = [application.id, userId, "Changed name", "changed@example.test", "Changed contact", "Changed response", "Changed notes"];
        if (includeInviter) args.push("Changed inviter");
        const placeholders = args.map((_, index) => `$${index + 1}`).join(",");
        const edited = await db.query(`select * from update_unpaid_application(${placeholders})`, args);
        assert.deepEqual(edited.rows, [], `${status} / ${orderStatus ?? "no order"}`);
        assert.deepEqual((await db.query("select * from applications where id=$1", [application.id])).rows[0], before);
      }
    }
  }
});

test("payment and refund records still lock applicant edits if the application returns to review", async () => {
  const application = await submit("INVITE-TEST", { invitedBy: "Original" });
  const order = await orderFor(application.id);
  await db.query("update applications set status='pending_review' where id=$1", [application.id]);
  for (const status of ["paid", "partially_refunded", "refunded"]) {
    await db.query("update orders set status=$2 where id=$1", [order.id, status]);
    assert.deepEqual(await editInviter(application.id, "Changed"), []);
  }
  await db.query("update orders set status='checkout_created' where id=$1", [order.id]);
  const paymentId = randomUUID();
  await db.query("insert into payments(id,order_id,provider,status,currency) values($1,$2,'stripe','processing','usd')", [paymentId, order.id]);
  for (const status of ["processing", "succeeded", "partially_refunded", "refunded"]) {
    await db.query("update payments set status=$2 where id=$1", [paymentId, status]);
    assert.deepEqual(await editInviter(application.id, "Changed"), []);
  }
});

test("administrators can correct paid applications with an audit trail and unchanged commissions", async () => {
  await db.query("insert into user_roles(user_id,role) values($1,'admin')", [userId]);
  const application = await submit(discountCode, { invitedBy: "Original" });
  const order = await orderFor(application.id);
  await pay(order.id);
  const before = (await db.query<Record<string, any>>("select * from applications where id=$1", [application.id])).rows[0];
  const previousOrders = (await db.query("select * from orders where application_id=$1", [application.id])).rows;
  const previousCommissions = (await db.query("select * from commissions")).rows;
  const edited = await adminEditInviter(application.id, "  Corrected / 김민수  ");
  assert.equal(edited.invited_by, "Corrected / 김민수");
  const { invited_by, updated_at, ...savedFields } = edited;
  const { invited_by: previousInviter, updated_at: previousUpdated, ...previousFields } = before;
  assert.deepEqual(savedFields, previousFields);
  assert.deepEqual((await db.query("select * from orders where application_id=$1", [application.id])).rows, previousOrders);
  assert.deepEqual((await db.query("select * from commissions")).rows, previousCommissions);
  const audit = (await db.query<Record<string, any>>("select * from admin_audit_logs where target_id=$1", [application.id])).rows[0];
  assert.equal(audit.admin_user_id, userId);
  assert.equal(audit.action, "application.invited_by_updated");
  assert.deepEqual(audit.metadata, { previousInvitedBy: "Original", invitedBy: "Corrected / 김민수" });
  await adminEditInviter(application.id, "Corrected / 김민수");
  assert.equal((await db.query("select * from admin_audit_logs where target_id=$1", [application.id])).rows.length, 1);
  assert.equal((await adminEditInviter(application.id, "   ")).invited_by, null);
  assert.equal((await db.query("select * from admin_audit_logs where target_id=$1", [application.id])).rows.length, 2);
});

test("admin inviter corrections reject non-admins, direct applications and excessive text", async () => {
  const referred = await submit("INVITE-TEST", { invitedBy: "Original" });
  await assert.rejects(adminEditInviter(referred.id, "Changed"), /Administrator access/);
  await db.query("insert into user_roles(user_id,role) values($1,'admin')", [userId]);
  const direct = await submit("", {}, null);
  await assert.rejects(adminEditInviter(direct.id, "Changed"), /no distributor referral/);
  await assert.rejects(adminEditInviter(randomUUID(), "Changed"), /Application not found/);
  await assert.rejects(adminEditInviter(referred.id, "가".repeat(201)), /200 characters or fewer/);
  assert.equal((await db.query<{ invited_by: string }>("select invited_by from applications where id=$1", [referred.id])).rows[0].invited_by, "Original");
  assert.equal((await db.query("select * from admin_audit_logs where target_id=$1", [referred.id])).rows.length, 0);
});

test("a failed admin audit rolls back the inviter correction", async () => {
  await db.query("insert into user_roles(user_id,role) values($1,'admin')", [userId]);
  const application = await submit("INVITE-TEST", { invitedBy: "Original" });
  await assert.rejects(adminEditInviter(application.id, "Changed", null), /not-null constraint/);
  assert.equal((await db.query<{ invited_by: string }>("select invited_by from applications where id=$1", [application.id])).rows[0].invited_by, "Original");
});

test("legacy deployment interface accepts ordinary invites but cannot attach a discount without pricing", async () => {
  const application = await submit("", {}, null);
  const rejected = await db.query("select * from attach_referral_to_application($1,$2,$3)", [application.id, userId, discountCode]);
  assert.equal(rejected.rows.length, 0);
  const attached = await db.query("select * from attach_referral_to_application($1,$2,'INVITE-TEST')", [application.id, userId]);
  assert.equal(attached.rows.length, 1);
  const saved = (await db.query<Record<string, any>>("select * from applications where id=$1", [application.id])).rows[0];
  assert.equal(saved.referral_code, "INVITE-TEST");
  assert.equal(saved.discount_amount, 0);
});

test("one discount code is reused across permission toggles; normal invites remain valid", async () => {
  await toggle(false);
  await assert.rejects(submit(), /no longer available/);
  await submit("INVITE-TEST", {}, null);
  await toggle(true);
  await toggle(true);
  const codes = (await db.query<{code: string}>("select code from referral_codes where kind='discount'")).rows;
  assert.deepEqual(codes.map((code) => code.code), [discountCode]);
  await db.query("select set_distributor_status($1,'inactive')", [distributorId]);
  await assert.rejects(submit(), /no longer available/);
  await assert.rejects(toggle(true), /Enable the distributor first/);
  await toggle(false);
  await db.query("select set_distributor_status($1,'active')", [distributorId]);
  await assert.rejects(submit(), /no longer available/);
});

test("invalid codes and unsupported programs are rejected without orphan records", async () => {
  for (const code of ["INVALID", "%", "_"]) await assert.rejects(submit(code), /no longer available/);
  for (const selectedTicket of ["two_weeks", "full_program", "fellowship", "fellowship_single_week", "fellowship_two_weeks", "fellowship_full_program"]) {
    await assert.rejects(submit(discountCode, { selectedTicket }), /only available for the 1 Week/);
  }
  await assert.rejects(submit(discountCode, {}, null), /not configured/);
  await assert.rejects(submit(discountCode, { selectedWeeks: [] }), /constraint/);
  assert.equal((await db.query("select * from applications")).rows.length, 0);
  assert.equal((await db.query("select * from referrals")).rows.length, 0);
  assert.equal((await db.query<{count: number}>("select sum(used_count)::int as count from referral_codes")).rows[0].count, 0);
});

test("server fixes price and attribution, ignoring client-supplied amounts and distributor", async () => {
  const application = await submit(` ${discountCode.toLowerCase()} `, { amountDue: 1, discountAmount: 979900, distributorId: randomUUID() });
  assert.equal(application.original_amount, 979900);
  assert.equal(application.discount_amount, 129900);
  assert.equal(application.amount_due, 850000);
  assert.equal(application.pricing_currency, "usd");
  assert.equal(application.discount_code, discountCode);
  assert.equal(application.referral_code, discountCode);
  assert.equal(application.distributor_id, distributorId);
  assert.equal((await db.query("select * from referrals where id=$1", [application.referral_id])).rows.length, 1);
});

test("Fellowship accepts every week combination and supports approval, checkout and payment", async () => {
  const combinations = [
    { ticket: "fellowship_single_week", amount: 150000, weeks: [["week_1"], ["week_2"], ["week_3"]] },
    { ticket: "fellowship_two_weeks", amount: 240000, weeks: [["week_1", "week_2"], ["week_1", "week_3"], ["week_2", "week_3"]] },
    { ticket: "fellowship_full_program", amount: 300000, weeks: [["week_1", "week_2", "week_3"]] },
  ];
  for (const option of combinations) {
    for (const selectedWeeks of option.weeks) {
      const application = await submit("", { selectedTicket: option.ticket, selectedWeeks }, null);
      assert.deepEqual(application.selected_weeks, selectedWeeks);
      await assert.rejects(db.query("select * from create_application_order($1,$2,'usd')", [application.id, option.amount]), /not approved/);
      await db.query("update applications set status='approved' where id=$1", [application.id]);
      const order = (await db.query<Record<string, any>>("select * from create_application_order($1,$2,'usd')", [application.id, option.amount])).rows[0];
      assert.equal(order.selected_ticket, option.ticket);
      assert.equal(order.amount, option.amount);
      const repeated = (await db.query<Record<string, any>>("select * from create_application_order($1,$2,'usd')", [application.id, option.amount])).rows[0];
      assert.equal(repeated.id, order.id);
      await db.query("update orders set stripe_checkout_session_id=$2 where id=$1", [order.id, `cs_${order.id}`]);
      await pay(order.id, option.amount);
      assert.equal((await db.query<{ status: string }>("select status from applications where id=$1", [application.id])).rows[0].status, "paid");
    }
  }
});

test("Fellowship rejects missing, duplicate, invalid and wrong-count weeks", async () => {
  for (const [selectedTicket, selections] of [
    ["fellowship_single_week", [[], ["week_4"], [null], ["week_1", "week_2"]]],
    ["fellowship_two_weeks", [[], ["week_1"], ["week_1", "week_1"], ["week_1", "week_4"], ["week_1", null], ["week_1", "week_2", "week_3"]]],
    ["fellowship_full_program", [[], ["week_1", "week_2"], ["week_1", "week_2", "week_2"]]],
  ] as const) {
    for (const selectedWeeks of selections) {
      await assert.rejects(submit("", { selectedTicket, selectedWeeks }, null), /constraint/);
    }
  }
});

test("historical funded Fellowship applications remain readable and cannot be charged", async () => {
  const application = await submit("", { selectedTicket: "fellowship", selectedWeeks: [] }, null);
  await db.query("update applications set status='approved' where id=$1", [application.id]);
  await assert.rejects(db.query("select * from create_application_order($1,300000,'usd')", [application.id]), /not approved for payment/);
});

test("submitted offer survives revocation and is copied to one reusable order", async () => {
  const application = await submit();
  await toggle(false);
  const order = await orderFor(application.id);
  assert.equal(order.amount, 850000);
  assert.equal(order.stripe_coupon_id, "coupon_fixed");
  const repeated = (await db.query<Record<string, any>>("select * from create_application_order($1,123,'eur')", [application.id])).rows[0];
  assert.equal(repeated.id, order.id);
  assert.equal(repeated.amount, 850000);
  assert.equal(repeated.currency, "usd");
  assert.equal(await commission(), 0);
  await pay(order.id);
  assert.equal(await commission(), 76500);
});

test("unpaid, wrong-session, wrong-currency and wrong-amount callbacks cannot create commission", async () => {
  const order = await orderFor((await submit()).id);
  await assert.rejects(pay(order.id, 850000, "usd", "unpaid"), /not confirmed/);
  await assert.rejects(pay(order.id, 850000, "usd", "paid", "cs_wrong"), /not confirmed/);
  await assert.rejects(pay(order.id, 979900), /saved discount price/);
  await assert.rejects(pay(order.id, 850000, "eur"), /saved discount price/);
  assert.equal(await commission(), 0);
  assert.equal((await db.query("select * from payments")).rows.length, 0);
  await pay(order.id);
  await pay(order.id);
  assert.equal(await commission(), 76500);
  assert.equal((await db.query("select * from payments")).rows.length, 1);
});

test("all four tiers, retroactive adjustments, refunds and late payment events use net actual payments", async () => {
  const orders = [];
  for (let count = 1; count <= 10; count++) {
    const order = await orderFor((await submit()).id); orders.push(order);
    await pay(order.id);
    const rate = count >= 10 ? 0.3 : count >= 5 ? 0.2 : count >= 3 ? 0.15 : 0.09;
    assert.equal(await commission(), Math.floor(count * 850000 * rate));
  }
  await db.query("select sync_charge_refund_totals($1,850000)", [`pi_${orders[0].id}`]);
  assert.equal(await commission(), 1530000);
  await db.query("select sync_charge_refund_totals($1,50000)", [`pi_${orders[1].id}`]);
  assert.equal(await commission(), 1520000);
  await pay(orders[0].id);
  await pay(orders[1].id);
  assert.equal(await commission(), 1520000);
  assert.equal((await db.query<{status: string}>("select status from orders where id=$1", [orders[0].id])).rows[0].status, "refunded");
  assert.equal((await db.query<{status: string}>("select status from orders where id=$1", [orders[1].id])).rows[0].status, "partially_refunded");
});

test("all Fellowship packages earn 10% without qualifying for a tier or duplicating payments", async () => {
  let expected = 0;
  for (const [ticket, amount, weeks] of [
    ["fellowship_single_week", 150000, ["week_1"]],
    ["fellowship_two_weeks", 240000, ["week_1", "week_3"]],
    ["fellowship_full_program", 300000, ["week_1", "week_2", "week_3"]],
  ] as const) {
    const order = await fellowshipOrder(ticket, amount, [...weeks]);
    assert.equal(await commission(), expected);
    await pay(order.id, amount);
    await pay(order.id, amount);
    expected += amount / 10;
    assert.equal(await commission(), expected);
    assert.equal(await modelCommission("fellowship"), expected);
    assert.equal(await paidTierCount(), 0);
  }
  const entries = (await db.query<{rate: string; commission_model: string}>("select rate, commission_model from commissions")).rows;
  assert.equal(entries.length, 3);
  assert.ok(entries.every((entry) => Number(entry.rate) === 10 && entry.commission_model === "fellowship"));
});

test("Fellowship does not advance any tier or receive retroactive tier increases", async () => {
  const fellowship = await fellowshipOrder();
  await pay(fellowship.id, 150000);
  let netTierPayments = 0;
  for (let count = 1; count <= 10; count++) {
    const isDiscount = count % 2 === 0;
    const amount = isDiscount ? 850000 : 979900;
    const order = await orderFor((await submit(isDiscount ? discountCode : "INVITE-TEST")).id);
    await pay(order.id, amount);
    netTierPayments += amount;
    const rate = count >= 10 ? 0.3 : count >= 5 ? 0.2 : count >= 3 ? 0.15 : 0.09;
    assert.equal(await paidTierCount(), count);
    assert.equal(await modelCommission("tiered"), Math.floor(netTierPayments * rate));
    assert.equal(await modelCommission("fellowship"), 15000);
    assert.equal(await commission(), Math.floor(netTierPayments * rate) + 15000);
  }
  const fellowshipEntries = await db.query("select * from commissions where commission_model='fellowship'");
  assert.equal(fellowshipEntries.rows.length, 1);
});

test("Single Week Access two- and three-week packages each count as one tier referral", async () => {
  for (const [ticket, amount, weeks] of [
    ["two_weeks", 1959800, ["week_1", "week_2"]],
    ["full_program", 2939700, ["week_1", "week_2", "week_3"]],
  ] as const) {
    const order = await orderFor((await submit("INVITE-TEST", { selectedTicket: ticket, selectedWeeks: weeks }, null)).id, amount);
    await pay(order.id, amount);
  }
  assert.equal(await paidTierCount(), 2);
  assert.equal(await modelCommission("tiered"), 440955);
  assert.equal(await modelCommission("fellowship"), 0);
});

test("mixed refunds downgrade only Single Week Access and preserve fixed Fellowship commission", async () => {
  const fellowship = await fellowshipOrder();
  await pay(fellowship.id, 150000);
  const orders = [];
  for (let count = 0; count < 3; count++) {
    const order = await orderFor((await submit()).id);
    await pay(order.id);
    orders.push(order);
  }
  assert.equal(await commission(), 397500);
  await db.query("select sync_charge_refund_totals($1,50001)", [`pi_${fellowship.id}`]);
  assert.equal(await paidTierCount(), 3);
  assert.equal(await modelCommission("fellowship"), 9999);
  assert.equal(await modelCommission("tiered"), 382500);
  await db.query("select sync_charge_refund_totals($1,850000)", [`pi_${orders[0].id}`]);
  assert.equal(await paidTierCount(), 2);
  assert.equal(await modelCommission("tiered"), 153000);
  assert.equal(await modelCommission("fellowship"), 9999);
  await db.query("select sync_charge_refund_totals($1,150000)", [`pi_${fellowship.id}`]);
  assert.equal(await commission(), 153000);
  assert.equal(await paidTierCount(), 2);
  const entryCount = (await db.query("select id from commissions")).rows.length;
  await pay(fellowship.id, 150000);
  await db.query("select sync_charge_refund_totals($1,150000)", [`pi_${fellowship.id}`]);
  await db.query("select recalculate_all_distributor_commissions()");
  assert.equal((await db.query("select id from commissions")).rows.length, entryCount);
  assert.equal((await db.query("select id from commissions where commission_amount < 0 and status <> 'approved'")).rows.length, 0);
});

test("editing tier settings leaves Fellowship at 10%", async () => {
  const fellowship = await fellowshipOrder();
  await pay(fellowship.id, 150000);
  await pay((await orderFor((await submit()).id)).id);
  await db.exec("begin");
  try {
    await db.exec("update distributor_tiers set commission_rate=45 where tier_key='single_seat'");
    await db.query("select recalculate_all_distributor_commissions()");
    assert.equal(await modelCommission("tiered"), 382500);
    assert.equal(await modelCommission("fellowship"), 15000);
    assert.equal((await db.query("select id from commissions where commission_model='fellowship'")).rows.length, 1);
  } finally { await db.exec("rollback"); }
});

test("Fellowship honors distributor status and permanent manual commission reversals", async () => {
  const fellowship = await fellowshipOrder();
  await pay(fellowship.id, 150000);
  const entryId = (await db.query<{id: string}>("select id from commissions")).rows[0].id;
  await db.query("select set_commission_status($1,'reversed')", [entryId]);
  await db.query("select recalculate_all_distributor_commissions()");
  assert.equal(await commission(), 0);
  const second = await fellowshipOrder();
  await pay(second.id, 150000);
  assert.equal(await commission(), 15000);
  await db.query("select set_distributor_status($1,'inactive')", [distributorId]);
  assert.equal(await commission(), 0);
  await db.query("select set_distributor_status($1,'active')", [distributorId]);
  assert.equal(await commission(), 15000);
  await db.query("select recalculate_all_distributor_commissions()");
  assert.equal(await commission(), 15000);
});

test("migration reconciles historical mixed paid commissions without rewriting settlements", async () => {
  await db.exec("begin");
  try {
    // Recreate the deployed calculation before migration 019 with existing data.
    await db.exec("alter table commissions drop column commission_model");
    await db.exec(await readFile("supabase/migrations/015_commission_ledger_consistency.sql", "utf8"));
    for (let count = 0; count < 2; count++) await pay((await orderFor((await submit()).id)).id);
    const fellowship = await fellowshipOrder();
    await pay(fellowship.id, 150000);
    assert.equal(await commission(), 277500); // Three referrals previously qualified for 15%.
    await db.exec("update commissions set status='paid', paid_at=now()");
    const oldEntries = (await db.query("select id, commission_amount, rate, status, paid_at from commissions order by id")).rows;
    await db.exec(await readFile("supabase/migrations/019_fellowship_fixed_commissions.sql", "utf8"));
    assert.equal(await paidTierCount(), 2);
    assert.equal(await modelCommission("tiered"), 153000);
    assert.equal(await modelCommission("fellowship"), 15000);
    assert.equal(await commission(), 168000);
    assert.deepEqual((await db.query("select id, commission_amount, rate, status, paid_at from commissions where status='paid' order by id")).rows, oldEntries);
    assert.equal(Number((await db.query<{total: string}>("select sum(commission_amount) as total from commissions where status in ('pending','approved')")).rows[0].total), -109500);
    const entryCount = (await db.query("select id from commissions")).rows.length;
    await db.query("select recalculate_all_distributor_commissions()");
    assert.equal((await db.query("select id from commissions")).rows.length, entryCount);
  } finally { await db.exec("rollback"); }
});

test("manual reversal of Fellowship is not recreated when tiered commissions also exist", async () => {
  await pay((await orderFor((await submit()).id)).id);
  const fellowship = await fellowshipOrder();
  await pay(fellowship.id, 150000);
  const entryId = (await db.query<{id: string}>("select id from commissions where commission_model='fellowship'")).rows[0].id;
  await db.query("select set_commission_status($1,'reversed')", [entryId]);
  await db.query("select recalculate_all_distributor_commissions()");
  assert.equal(await modelCommission("fellowship"), 0);
  assert.equal(await modelCommission("tiered"), 76500);
  assert.equal((await db.query("select id from commissions")).rows.length, 2);
  await db.query("select sync_charge_refund_totals($1,150000)", [`pi_${fellowship.id}`]);
  assert.equal(await commission(), 61500); // Keep the existing currency-wide permanent waiver.
});

test("migration preserves legacy manual waivers even when all orders are Fellowship", async () => {
  await db.exec("begin");
  try {
    await db.exec("alter table commissions drop column commission_model");
    await db.exec(await readFile("supabase/migrations/015_commission_ledger_consistency.sql", "utf8"));
    const fellowship = await fellowshipOrder();
    await pay(fellowship.id, 150000);
    assert.equal(await commission(), 13500);
    const entryId = (await db.query<{id: string}>("select id from commissions")).rows[0].id;
    await db.query("select set_commission_status($1,'reversed')", [entryId]);
    await db.exec(await readFile("supabase/migrations/019_fellowship_fixed_commissions.sql", "utf8"));
    assert.equal(await commission(), 1500); // 10% entitlement less the original $135 waiver.
    assert.equal(await paidTierCount(), 0);
    await db.query("select recalculate_all_distributor_commissions()");
    assert.equal(await commission(), 1500);
  } finally { await db.exec("rollback"); }
});

test("client roles cannot invoke price/permission RPCs or bypass submission with direct inserts", async () => {
  for (const role of ["anon", "authenticated"]) {
    for (const signature of ["submit_application(uuid,jsonb,text,text)", "set_distributor_discount(uuid,boolean)", "create_application_order(uuid,integer,text)", "update_unpaid_application(uuid,uuid,text,text,text,text,text,text)", "admin_update_application_invited_by(uuid,text,uuid,text)"]) {
      const result = await db.query<{allowed: boolean}>("select has_function_privilege($1,$2,'execute') as allowed", [role, signature]);
      assert.equal(result.rows[0].allowed, false);
    }
  }
  await db.exec("grant insert on applications to authenticated; set role authenticated");
  try {
    await assert.rejects(db.query("insert into applications(id,user_id,name,email,company,title,country,city,applicant_type,selected_ticket,selected_weeks,status) values($1,$2,'x','x@example.test','','','','','other','single_week',array['week_1'],'pending_review')", [randomUUID(), userId]), /row-level security/);
  } finally { await db.exec("reset role"); }
});
