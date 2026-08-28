export type ApplicantType = "founder" | "investor" | "institution" | "partner" | "other";
export type ProgramWeek = "week_1" | "week_2" | "week_3";

export type ApplicationStatus =
  | "pending_review"
  | "interview_invited"
  | "interview_scheduled"
  | "approved"
  | "rejected"
  | "more_info_required"
  | "payment_sent"
  | "paid"
  | "canceled";

export type OrderStatus =
  | "pending"
  | "checkout_created"
  | "paid"
  | "partially_refunded"
  | "payment_failed"
  | "canceled"
  | "refunded"
  | "expired";

export type PaymentStatus = "processing" | "succeeded" | "partially_refunded" | "failed" | "refunded";

export type RefundRequestStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "rejected"
  | "failed"
  | "canceled";

export type DistributorStatus = "active" | "inactive";
export type ReferralCodeStatus = "active" | "inactive";
export type CommissionStatus = "pending" | "approved" | "paid" | "reversed";
export type UserRole = "admin";

export type TicketId = "single_week" | "two_weeks" | "full_program" | "fellowship";

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
  selectedWeeks: ProgramWeek[];
  alternateContact: string;
  message: string;
  additionalInfo: string;
  status: ApplicationStatus;
  referralId: string | null;
  referralCode: string | null;
  distributorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string | null;
  applicationId: string;
  selectedTicket: TicketId;
  amount: number | null;
  refundedAmount: number;
  currency: string;
  status: OrderStatus;
  checkoutUrl: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  paymentLinkExpiresAt: string | null;
  referralId: string | null;
  referralCode: string | null;
  distributorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  orderId: string;
  provider: "stripe";
  providerPaymentId: string | null;
  amount: number | null;
  refundedAmount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  rawPayload: unknown;
  createdAt: string;
};

export type RefundRequest = {
  id: string;
  orderId: string;
  userId: string | null;
  requestedAmount: number;
  approvedAmount: number | null;
  currency: string;
  reason: string;
  adminNote: string | null;
  status: RefundRequestStatus;
  stripeRefundId: string | null;
  stripeStatus: string | null;
  failureReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  adminUserId: string | null;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AdminUserOption = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastSignInAt: string | null;
};

export type Distributor = {
  id: string;
  userId: string | null;
  name: string;
  email: string | null;
  status: DistributorStatus;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
};

export type DistributorTier = {
  id: string;
  key: "single_seat" | "starter" | "standard" | "growth";
  name: string;
  minimumReferrals: number;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
};

export type ReferralCode = {
  id: string;
  code: string;
  distributorId: string;
  usedCount: number;
  status: ReferralCodeStatus;
  createdAt: string;
  updatedAt: string;
};

export type Referral = {
  id: string;
  codeId: string;
  distributorId: string;
  userId: string | null;
  applicationId: string;
  codeSnapshot: string;
  attributionMethod: string;
  createdAt: string;
  lockedAt: string;
};

export type Commission = {
  id: string;
  orderId: string;
  referralId: string;
  beneficiaryDistributorId: string;
  level: number;
  rate: number;
  basisAmount: number;
  commissionAmount: number;
  entryType: "payment" | "tier_adjustment" | "refund_adjustment" | "status_adjustment";
  refundedBasisAmount: number;
  refundedCommissionAmount: number;
  currency: string;
  status: CommissionStatus;
  paidAt: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
  createdAt: string;
};

export type AppData = {
  applications: Application[];
  orders: Order[];
  payments: Payment[];
  refundRequests: RefundRequest[];
  stripeEvents: StripeEventRecord[];
  adminAuditLogs: AdminAuditLog[];
  distributors: Distributor[];
  referralCodes: ReferralCode[];
  referrals: Referral[];
  commissions: Commission[];
};
