import type { TicketId } from "./types";

type TicketConfig = {
  id: TicketId;
  label: string;
  description: string;
  amountEnv: string;
  priceEnv: string;
};

export const ticketOptions: TicketConfig[] = [
  {
    id: "full_program",
    label: "Full program",
    description: "Nov 1 - Nov 21, full three-week immersion",
    amountEnv: "ARCH_TICKET_AMOUNT_FULL_PROGRAM",
    priceEnv: "STRIPE_PRICE_FULL_PROGRAM",
  },
  {
    id: "week_1",
    label: "Week 1",
    description: "AI Application Frontier, Nov 1 - Nov 8",
    amountEnv: "ARCH_TICKET_AMOUNT_WEEK_1",
    priceEnv: "STRIPE_PRICE_WEEK_1",
  },
  {
    id: "week_2",
    label: "Week 2",
    description: "Robotics & Embodied Intelligence, Nov 8 - Nov 15",
    amountEnv: "ARCH_TICKET_AMOUNT_WEEK_2",
    priceEnv: "STRIPE_PRICE_WEEK_2",
  },
  {
    id: "week_3",
    label: "Week 3",
    description: "Hardware, Supply Chain & Scale, Nov 15 - Nov 21",
    amountEnv: "ARCH_TICKET_AMOUNT_WEEK_3",
    priceEnv: "STRIPE_PRICE_WEEK_3",
  },
  {
    id: "deposit",
    label: "Seat deposit",
    description: "Deposit to reserve an approved seat",
    amountEnv: "ARCH_TICKET_AMOUNT_DEPOSIT",
    priceEnv: "STRIPE_PRICE_DEPOSIT",
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
