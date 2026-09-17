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
async function orderFor(applicationId: string) {
  await db.query("update applications set status='approved' where id=$1", [applicationId]);
  const order = (await db.query<Record<string, any>>("select * from create_application_order($1,979900,'usd')", [applicationId])).rows[0];
  await db.query("update orders set stripe_checkout_session_id=$2, status='checkout_created' where id=$1", [order.id, `cs_${order.id}`]);
  return order;
}
async function pay(orderId: string, amount = 850000, currency = "usd", status = "paid", sessionId = `cs_${orderId}`) {
  await db.query("select mark_order_paid($1,$2,'cus_test',$3,$4,$5)", [orderId, `pi_${orderId}`, amount, currency, { data: { object: { id: sessionId, payment_status: status } } }]);
}
async function commission() {
  return Number((await db.query<{total: string}>("select coalesce(sum(commission_amount),0) as total from commissions where status <> 'reversed'")).rows[0].total);
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

test("client roles cannot invoke price/permission RPCs or bypass submission with direct inserts", async () => {
  for (const role of ["anon", "authenticated"]) {
    for (const signature of ["submit_application(uuid,jsonb,text,text)", "set_distributor_discount(uuid,boolean)", "create_application_order(uuid,integer,text)"]) {
      const result = await db.query<{allowed: boolean}>("select has_function_privilege($1,$2,'execute') as allowed", [role, signature]);
      assert.equal(result.rows[0].allowed, false);
    }
  }
  await db.exec("grant insert on applications to authenticated; set role authenticated");
  try {
    await assert.rejects(db.query("insert into applications(id,user_id,name,email,company,title,country,city,applicant_type,selected_ticket,selected_weeks,status) values($1,$2,'x','x@example.test','','','','','other','single_week',array['week_1'],'pending_review')", [randomUUID(), userId]), /row-level security/);
  } finally { await db.exec("reset role"); }
});
