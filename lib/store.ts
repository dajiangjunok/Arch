import { promises as fs } from "fs";
import path from "path";
import { getConfiguredTicketAmount, getCurrency } from "./tickets";
import type {
  AdminAuditLog,
  AppData,
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

const dataFilePath = process.env.ARCH_DATA_FILE || path.join(".data", "arch-data.json");

const defaultData: AppData = {
  applications: [],
  orders: [],
  payments: [],
  stripeEvents: [],
  adminAuditLogs: [],
};

let writeQueue = Promise.resolve();

async function readData(): Promise<AppData> {
  try {
    const raw = await fs.readFile(dataFilePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<AppData>;

    return {
      applications: parsed.applications || [],
      orders: parsed.orders || [],
      payments: parsed.payments || [],
      stripeEvents: parsed.stripeEvents || [],
      adminAuditLogs: parsed.adminAuditLogs || [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return defaultData;
    }

    throw error;
  }
}

async function writeData(data: AppData) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

async function updateData<T>(updater: (data: AppData) => T | Promise<T>) {
  const run = async () => {
    const data = await readData();
    const result = await updater(data);

    await writeData(data);

    return result;
  };

  const result = writeQueue.then(run, run);
  writeQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
}

function now() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createApplication(input: {
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
  return updateData((data) => {
    const timestamp = now();
    const application: Application = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      email: normalizeEmail(input.email),
      company: input.company.trim(),
      title: input.title.trim(),
      country: input.country.trim(),
      city: input.city.trim(),
      applicantType: input.applicantType,
      selectedTicket: input.selectedTicket,
      message: input.message.trim(),
      status: "pending_review",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    data.applications.unshift(application);

    return application;
  });
}

export async function listApplications() {
  const data = await readData();

  return data.applications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getApplication(id: string) {
  const data = await readData();

  return data.applications.find((application) => application.id === id) || null;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  return updateData((data) => {
    const application = data.applications.find((item) => item.id === id);

    if (!application) {
      throw new Error("Application not found.");
    }

    application.status = status;
    application.updatedAt = now();

    return application;
  });
}

export async function listOrders() {
  const data = await readData();

  return data.orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrdersForApplication(applicationId: string) {
  const data = await readData();

  return data.orders
    .filter((order) => order.applicationId === applicationId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string) {
  const data = await readData();

  return data.orders.find((order) => order.id === id) || null;
}

export async function getOrderByCheckoutSession(sessionId: string) {
  const data = await readData();

  return data.orders.find((order) => order.stripeCheckoutSessionId === sessionId) || null;
}

export async function createOrderForApplication(application: Application) {
  return updateData((data) => {
    const timestamp = now();
    const order: Order = {
      id: crypto.randomUUID(),
      applicationId: application.id,
      selectedTicket: application.selectedTicket,
      amount: getConfiguredTicketAmount(application.selectedTicket),
      currency: getCurrency(),
      status: "pending",
      checkoutUrl: null,
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
      stripeCustomerId: null,
      paymentLinkExpiresAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    data.orders.unshift(order);

    return order;
  });
}

export async function updateOrder(id: string, patch: Partial<Omit<Order, "id" | "createdAt">>) {
  return updateData((data) => {
    const order = data.orders.find((item) => item.id === id);

    if (!order) {
      throw new Error("Order not found.");
    }

    Object.assign(order, patch, { updatedAt: now() });

    return order;
  });
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
  return updateData((data) => {
    const existing = data.payments.find(
      (payment) => payment.provider === "stripe" && payment.providerPaymentId === input.providerPaymentId,
    );

    if (existing) {
      existing.status = input.status;
      existing.rawPayload = input.rawPayload;
      existing.paidAt = input.paidAt;
      return existing;
    }

    const payment: Payment = {
      id: crypto.randomUUID(),
      provider: "stripe",
      createdAt: now(),
      ...input,
    };

    data.payments.unshift(payment);

    return payment;
  });
}

export async function listPaymentsForOrder(orderId: string) {
  const data = await readData();

  return data.payments
    .filter((payment) => payment.orderId === orderId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function hasProcessedStripeEvent(stripeEventId: string) {
  const data = await readData();

  return data.stripeEvents.some((event) => event.stripeEventId === stripeEventId);
}

export async function recordStripeEvent(input: {
  stripeEventId: string;
  type: string;
  rawPayload: unknown;
}) {
  return updateData((data) => {
    const existing = data.stripeEvents.find((event) => event.stripeEventId === input.stripeEventId);

    if (existing) {
      return existing;
    }

    const event: StripeEventRecord = {
      id: crypto.randomUUID(),
      processedAt: now(),
      ...input,
    };

    data.stripeEvents.unshift(event);

    return event;
  });
}

export async function recordAdminAuditLog(input: Omit<AdminAuditLog, "id" | "createdAt">) {
  return updateData((data) => {
    const auditLog: AdminAuditLog = {
      id: crypto.randomUUID(),
      createdAt: now(),
      ...input,
    };

    data.adminAuditLogs.unshift(auditLog);

    return auditLog;
  });
}

export async function markOrderPaid(input: {
  orderId: string;
  paymentIntentId: string | null;
  customerId: string | null;
  amount: number | null;
  currency: string;
  rawPayload: unknown;
}) {
  return updateData((data) => {
    const order = data.orders.find((item) => item.id === input.orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    const application = data.applications.find((item) => item.id === order.applicationId);
    const timestamp = now();

    order.status = "paid";
    order.stripePaymentIntentId = input.paymentIntentId;
    order.stripeCustomerId = input.customerId;
    order.amount = input.amount;
    order.currency = input.currency;
    order.updatedAt = timestamp;

    if (application) {
      application.status = "paid";
      application.updatedAt = timestamp;
    }

    data.payments.unshift({
      id: crypto.randomUUID(),
      orderId: order.id,
      provider: "stripe",
      providerPaymentId: input.paymentIntentId,
      amount: input.amount,
      currency: input.currency,
      status: "succeeded",
      paidAt: timestamp,
      rawPayload: input.rawPayload,
      createdAt: timestamp,
    });

    return order;
  });
}

export async function markOrderStatusBySession(sessionId: string, status: OrderStatus) {
  return updateData((data) => {
    const order = data.orders.find((item) => item.stripeCheckoutSessionId === sessionId);

    if (!order) {
      return null;
    }

    order.status = status;
    order.updatedAt = now();

    return order;
  });
}
