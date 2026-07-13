export type ApplicantType = "founder" | "investor" | "institution" | "partner" | "other";

export type ApplicationStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "more_info_required"
  | "payment_sent"
  | "paid"
  | "confirmed"
  | "canceled";

export type OrderStatus =
  | "pending"
  | "checkout_created"
  | "paid"
  | "payment_failed"
  | "canceled"
  | "refunded"
  | "expired";

export type PaymentStatus = "processing" | "succeeded" | "failed" | "refunded";

export type TicketId = "full_program" | "week_1" | "week_2" | "week_3" | "deposit";

export type Application = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  company: string;
  title: string;
  country: string;
  city: string;
  applicantType: ApplicantType;
  selectedTicket: TicketId;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string | null;
  applicationId: string;
  selectedTicket: TicketId;
  amount: number | null;
  currency: string;
  status: OrderStatus;
  checkoutUrl: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  paymentLinkExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  orderId: string;
  provider: "stripe";
  providerPaymentId: string | null;
  amount: number | null;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  rawPayload: unknown;
  createdAt: string;
};

export type StripeEventRecord = {
  id: string;
  stripeEventId: string;
  type: string;
  processedAt: string;
  rawPayload: unknown;
};

export type AdminAuditLog = {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AppData = {
  applications: Application[];
  orders: Order[];
  payments: Payment[];
  stripeEvents: StripeEventRecord[];
  adminAuditLogs: AdminAuditLog[];
};
