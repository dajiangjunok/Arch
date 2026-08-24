import { getTicketLabel } from "./tickets";
import type { ApplicationStatus, OrderStatus, PaymentStatus, ProgramWeek, RefundRequestStatus, TicketId } from "./types";

export function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatMoney(amount: number | null, currency: string) {
  if (amount === null) {
    return "Not configured";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function applicationStatusLabel(status: ApplicationStatus) {
  const labels: Record<ApplicationStatus, string> = {
    pending_review: "Pending review",
    approved: "Approved",
    rejected: "Rejected",
    more_info_required: "More info required",
    payment_sent: "Payment sent",
    paid: "Paid",
    confirmed: "Confirmed",
    canceled: "Canceled",
  };

  return labels[status];
}

export function orderStatusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    checkout_created: "Checkout created",
    paid: "Paid",
    partially_refunded: "Partially refunded",
    payment_failed: "Payment failed",
    canceled: "Canceled",
    refunded: "Refunded",
    expired: "Expired",
  };

  return labels[status];
}

export function paymentStatusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    processing: "Processing",
    succeeded: "Succeeded",
    partially_refunded: "Partially refunded",
    failed: "Failed",
    refunded: "Refunded",
  };

  return labels[status];
}

export function refundRequestStatusLabel(status: RefundRequestStatus) {
  const labels: Record<RefundRequestStatus, string> = {
    pending: "Pending review",
    processing: "Refund processing",
    succeeded: "Refunded",
    rejected: "Request declined",
    failed: "Refund failed",
    canceled: "Canceled",
  };

  return labels[status];
}

export function ticketLabel(ticketId: TicketId) {
  return getTicketLabel(ticketId);
}

export function programWeekLabel(week: ProgramWeek | null) {
  if (!week) return "-";

  const labels: Record<ProgramWeek, string> = {
    week_1: "Week 1",
    week_2: "Week 2",
    week_3: "Week 3",
  };

  return labels[week];
}
