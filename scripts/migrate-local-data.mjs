import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

async function loadEnv(file) {
  try {
    const raw = await fs.readFile(file, "utf8");

    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match || process.env[match[1]]) continue;
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

await loadEnv(path.resolve(".env"));
await loadEnv(path.resolve(".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Supabase URL and server secret are required.");
}

const data = JSON.parse(await fs.readFile(path.resolve(".data/arch-data.json"), "utf8"));
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

function normalizeTicketId(ticketId) {
  const legacyTickets = {
    full_program: "full_residency",
    week_1: "single_week_pass",
    week_2: "multi_week_pass",
    week_3: "full_residency",
  };

  if (ticketId === "deposit") {
    throw new Error("Legacy seat deposit records must be assigned to a current pass before migration.");
  }

  return legacyTickets[ticketId] || ticketId;
}

const batches = [
  ["applications", (data.applications || []).map((item) => ({
    id: item.id,
    user_id: item.userId || null,
    name: item.name,
    email: item.email,
    company: item.company,
    title: item.title,
    country: item.country,
    city: item.city,
    applicant_type: item.applicantType,
    selected_ticket: normalizeTicketId(item.selectedTicket),
    message: item.message,
    status: item.status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  }))],
  ["orders", (data.orders || []).map((item) => ({
    id: item.id,
    user_id: item.userId || null,
    application_id: item.applicationId,
    selected_ticket: normalizeTicketId(item.selectedTicket),
    amount: item.amount,
    currency: item.currency,
    status: item.status,
    checkout_url: item.checkoutUrl,
    stripe_checkout_session_id: item.stripeCheckoutSessionId,
    stripe_payment_intent_id: item.stripePaymentIntentId,
    stripe_customer_id: item.stripeCustomerId,
    payment_link_expires_at: item.paymentLinkExpiresAt,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  }))],
  ["payments", (data.payments || []).map((item) => ({
    id: item.id,
    order_id: item.orderId,
    provider: item.provider,
    provider_payment_id: item.providerPaymentId,
    amount: item.amount,
    currency: item.currency,
    status: item.status,
    paid_at: item.paidAt,
    raw_payload: item.rawPayload,
    created_at: item.createdAt,
  }))],
  ["stripe_events", (data.stripeEvents || []).map((item) => ({
    id: item.id,
    stripe_event_id: item.stripeEventId,
    type: item.type,
    processed_at: item.processedAt,
    raw_payload: item.rawPayload,
  }))],
  ["admin_audit_logs", (data.adminAuditLogs || []).map((item) => ({
    id: item.id,
    admin_email: item.adminEmail,
    action: item.action,
    target_type: item.targetType,
    target_id: item.targetId,
    metadata: item.metadata,
    created_at: item.createdAt,
  }))],
];

for (const [table, rows] of batches) {
  if (rows.length === 0) {
    console.log(`${table}: no rows`);
    continue;
  }

  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`${table}: migrated ${rows.length}`);
}
