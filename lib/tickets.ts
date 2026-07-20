import type { TicketId } from "./types";

type TicketConfig = {
  id: TicketId;
  label: string;
  priceLabel: string;
  description: string;
  amountEnv: string;
  priceEnv: string;
};

export const ticketOptions: TicketConfig[] = [
  {
    id: "single_week_pass",
    label: "Single Week Pass",
    priceLabel: "$2,000 USD",
    description: "One week, choose Week 1, 2, or 3",
    amountEnv: "ARCH_TICKET_AMOUNT_SINGLE_WEEK_PASS",
    priceEnv: "STRIPE_PRICE_SINGLE_WEEK_PASS",
  },
  {
    id: "multi_week_pass",
    label: "Multi-Week Pass",
    priceLabel: "$3,000 USD",
    description: "Two weeks, choose any two of three weeks",
    amountEnv: "ARCH_TICKET_AMOUNT_MULTI_WEEK_PASS",
    priceEnv: "STRIPE_PRICE_MULTI_WEEK_PASS",
  },
  {
    id: "full_residency",
    label: "Full Residency",
    priceLabel: "$5,000 USD",
    description: "Three weeks, Nov 1 - 21, complete immersion",
    amountEnv: "ARCH_TICKET_AMOUNT_FULL_RESIDENCY",
    priceEnv: "STRIPE_PRICE_FULL_RESIDENCY",
  },
];

export function getTicket(ticketId: TicketId) {
  const ticket = ticketOptions.find((item) => item.id === ticketId);

  if (!ticket) {
    throw new Error(`Unknown ticket: ${ticketId}`);
  }

  return ticket;
}

export function getTicketLabel(ticketId: TicketId) {
  return getTicket(ticketId).label;
}

export function getConfiguredTicketAmount(ticketId: TicketId) {
  const ticket = getTicket(ticketId);
  const rawAmount = process.env[ticket.amountEnv];

  if (!rawAmount) {
    return null;
  }

  const amount = Number.parseInt(rawAmount, 10);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${ticket.amountEnv} must be a positive amount in the smallest currency unit.`);
  }

  return amount;
}

export function getConfiguredStripePrice(ticketId: TicketId) {
  const ticket = getTicket(ticketId);

  return process.env[ticket.priceEnv] || null;
}

export function getCurrency() {
  return (process.env.ARCH_PAYMENT_CURRENCY || "usd").toLowerCase();
}
