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
    id: "single_week",
    label: "1 Week",
    priceLabel: "$9,799 USD",
    description: "Choose 1 week",
    amountEnv: "ARCH_TICKET_AMOUNT_SINGLE_WEEK",
    priceEnv: "STRIPE_PRICE_SINGLE_WEEK",
  },
  {
    id: "two_weeks",
    label: "2 Weeks",
    priceLabel: "$19,598 USD",
    description: "Choose 2 weeks",
    amountEnv: "ARCH_TICKET_AMOUNT_TWO_WEEKS",
    priceEnv: "STRIPE_PRICE_TWO_WEEKS",
  },
  {
    id: "full_program",
    label: "Full 3-Week Program",
    priceLabel: "$29,397 USD",
    description: "Includes Week 1, Week 2, and Week 3",
    amountEnv: "ARCH_TICKET_AMOUNT_FULL_PROGRAM",
    priceEnv: "STRIPE_PRICE_FULL_PROGRAM",
  },
  {
    id: "fellowship",
    label: "Fellowship Pass",
    priceLabel: "Funded",
    description: "A limited, funded place for builders and makers",
    amountEnv: "ARCH_TICKET_AMOUNT_FELLOWSHIP",
    priceEnv: "STRIPE_PRICE_FELLOWSHIP",
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
