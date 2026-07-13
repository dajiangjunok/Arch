import { getConfiguredTicketAmount, getCurrency } from "./tickets";
import { createSupabaseAdminClient } from "./supabase/admin";
import type {
  AdminAuditLog,
  ApplicantType,
  Application,
  ApplicationStatus,
  Order,
  OrderStatus,
  Payment,
  PaymentStatus,
  StripeEventRecord,
  TicketId,
} from "./types";

type ApplicationRow = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  company: string;
  title: string;
  country: string;
  city: string;
  applicant_type: ApplicantType;
  selected_ticket: TicketId;
  message: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

type OrderRow = {
  id: string;
  user_id: string | null;
  application_id: string;
  selected_ticket: TicketId;
  amount: number | null;
  currency: string;
  status: OrderStatus;
  checkout_url: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  payment_link_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

type PaymentRow = {
  id: string;
  order_id: string;
  provider: "stripe";
  provider_payment_id: string | null;
  amount: number | null;
  currency: string;
  status: PaymentStatus;
  paid_at: string | null;
  raw_payload: unknown;
  created_at: string;
};

function mapApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    company: row.company,
    title: row.title,
    country: row.country,
    city: row.city,
    applicantType: row.applicant_type,
    selectedTicket: row.selected_ticket,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    applicationId: row.application_id,
    selectedTicket: row.selected_ticket,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    checkoutUrl: row.checkout_url,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    stripeCustomerId: row.stripe_customer_id,
    paymentLinkExpiresAt: row.payment_link_expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    orderId: row.order_id,
    provider: row.provider,
    providerPaymentId: row.provider_payment_id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    paidAt: row.paid_at,
    rawPayload: row.raw_payload,
    createdAt: row.created_at,
  };
}

function now() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createApplication(input: {
  userId?: string | null;
  name: string;
  email: string;
  company: string;
  title: string;
  country: string;
  city: string;
  applicantType: ApplicantType;
  selectedTicket: TicketId;
  message: string;
}) {
  const timestamp = now();
  const { data, error } = await createSupabaseAdminClient()
    .from("applications")
    .insert({
      id: crypto.randomUUID(),
      user_id: input.userId || null,
      name: input.name.trim(),
      email: normalizeEmail(input.email),
      company: input.company.trim(),
      title: input.title.trim(),
      country: input.country.trim(),
      city: input.city.trim(),
      applicant_type: input.applicantType,
      selected_ticket: input.selectedTicket,
      message: input.message.trim(),
      status: "pending_review",
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select()
    .single();

  if (error) throw error;
  return mapApplication(data as ApplicationRow);
}

export async function listApplications() {
  const { data, error } = await createSupabaseAdminClient()
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ApplicationRow[]).map(mapApplication);
}

export async function listApplicationsForUser(userId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ApplicationRow[]).map(mapApplication);
}

export async function getApplication(id: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapApplication(data as ApplicationRow) : null;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const { data, error } = await createSupabaseAdminClient()
    .from("applications")
    .update({ status, updated_at: now() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapApplication(data as ApplicationRow);
}

export async function listOrders() {
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as OrderRow[]).map(mapOrder);
}

export async function listOrdersForUser(userId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as OrderRow[]).map(mapOrder);
}

export async function getOrdersForApplication(applicationId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as OrderRow[]).map(mapOrder);
}

export async function getOrder(id: string) {
  const { data, error } = await createSupabaseAdminClient().from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data as OrderRow) : null;
}

export async function getOrderByCheckoutSession(sessionId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .select("*")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapOrder(data as OrderRow) : null;
}

export async function createOrderForApplication(application: Application) {
  const timestamp = now();
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .insert({
      id: crypto.randomUUID(),
      user_id: application.userId,
      application_id: application.id,
      selected_ticket: application.selectedTicket,
      amount: getConfiguredTicketAmount(application.selectedTicket),
      currency: getCurrency(),
      status: "pending",
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select()
    .single();

  if (error) throw error;
  return mapOrder(data as OrderRow);
}

export async function updateOrder(id: string, patch: Partial<Omit<Order, "id" | "createdAt">>) {
  const rowPatch: Record<string, unknown> = { updated_at: now() };
  const fields: Record<string, string> = {
    userId: "user_id",
    applicationId: "application_id",
    selectedTicket: "selected_ticket",
    amount: "amount",
    currency: "currency",
    status: "status",
    checkoutUrl: "checkout_url",
    stripeCheckoutSessionId: "stripe_checkout_session_id",
    stripePaymentIntentId: "stripe_payment_intent_id",
    stripeCustomerId: "stripe_customer_id",
    paymentLinkExpiresAt: "payment_link_expires_at",
    updatedAt: "updated_at",
  };

  for (const [key, value] of Object.entries(patch)) {
    if (fields[key]) rowPatch[fields[key]] = value;
  }

  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .update(rowPatch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapOrder(data as OrderRow);
}

export async function upsertPayment(input: {
  orderId: string;
  providerPaymentId: string | null;
  amount: number | null;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  rawPayload: unknown;
}) {
  const row = {
    id: crypto.randomUUID(),
    order_id: input.orderId,
    provider: "stripe",
    provider_payment_id: input.providerPaymentId,
    amount: input.amount,
    currency: input.currency,
    status: input.status,
    paid_at: input.paidAt,
    raw_payload: input.rawPayload,
    created_at: now(),
  };
  const query = createSupabaseAdminClient().from("payments");
  const result = input.providerPaymentId
    ? await query.upsert(row, { onConflict: "provider,provider_payment_id" }).select().single()
    : await query.insert(row).select().single();

  if (result.error) throw result.error;
  return mapPayment(result.data as PaymentRow);
}

export async function listPaymentsForOrder(orderId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PaymentRow[]).map(mapPayment);
}

export async function listPaymentsForOrders(orderIds: string[]) {
  if (orderIds.length === 0) return [];

  const { data, error } = await createSupabaseAdminClient()
    .from("payments")
    .select("*")
    .in("order_id", orderIds)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PaymentRow[]).map(mapPayment);
}

export async function hasProcessedStripeEvent(stripeEventId: string) {
  const { count, error } = await createSupabaseAdminClient()
    .from("stripe_events")
    .select("id", { count: "exact", head: true })
    .eq("stripe_event_id", stripeEventId);

  if (error) throw error;
  return (count || 0) > 0;
}

export async function recordStripeEvent(input: {
  stripeEventId: string;
  type: string;
  rawPayload: unknown;
}) {
  const { data, error } = await createSupabaseAdminClient()
    .from("stripe_events")
    .upsert(
      {
        id: crypto.randomUUID(),
        stripe_event_id: input.stripeEventId,
        type: input.type,
        processed_at: now(),
        raw_payload: input.rawPayload,
      },
      { onConflict: "stripe_event_id", ignoreDuplicates: true },
    )
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as {
    id: string;
    stripe_event_id: string;
    type: string;
    processed_at: string;
    raw_payload: unknown;
  };
  return {
    id: row.id,
    stripeEventId: row.stripe_event_id,
    type: row.type,
    processedAt: row.processed_at,
    rawPayload: row.raw_payload,
  } satisfies StripeEventRecord;
}

export async function recordAdminAuditLog(input: Omit<AdminAuditLog, "id" | "createdAt">) {
  const { data, error } = await createSupabaseAdminClient()
    .from("admin_audit_logs")
    .insert({
      id: crypto.randomUUID(),
      admin_email: input.adminEmail,
      action: input.action,
      target_type: input.targetType,
      target_id: input.targetId,
      metadata: input.metadata,
      created_at: now(),
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    adminEmail: data.admin_email,
    action: data.action,
    targetType: data.target_type,
    targetId: data.target_id,
    metadata: data.metadata,
    createdAt: data.created_at,
  } as AdminAuditLog;
}

export async function markOrderPaid(input: {
  orderId: string;
  paymentIntentId: string | null;
  customerId: string | null;
  amount: number | null;
  currency: string;
  rawPayload: unknown;
}) {
  const { error } = await createSupabaseAdminClient().rpc("mark_order_paid", {
    p_order_id: input.orderId,
    p_payment_intent_id: input.paymentIntentId,
    p_customer_id: input.customerId,
    p_amount: input.amount,
    p_currency: input.currency,
    p_raw_payload: input.rawPayload,
  });

  if (error) throw error;
  const order = await getOrder(input.orderId);
  if (!order) throw new Error("Order not found.");
  return order;
}

export async function markOrderStatusBySession(sessionId: string, status: OrderStatus) {
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .update({ status, updated_at: now() })
    .eq("stripe_checkout_session_id", sessionId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data ? mapOrder(data as OrderRow) : null;
}
