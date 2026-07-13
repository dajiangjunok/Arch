import { NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { ticketOptions } from "@/lib/tickets";
import { createApplication, createOrderForApplication, updateApplicationStatus, updateOrder } from "@/lib/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicantType, Order, TicketId } from "@/lib/types";

const applicantTypes: ApplicantType[] = ["founder", "investor", "institution", "partner", "other"];

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Sign in before submitting an application." }, { status: 401 });
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "The application data is invalid." }, { status: 400 });
  }

  const name = readString(body.name);
  const company = readString(body.company);
  const title = readString(body.title);
  const country = readString(body.country);
  const city = readString(body.city);
  const message = readString(body.message);
  const applicantType = readString(body.applicantType) as ApplicantType;
  const selectedTicket = readString(body.selectedTicket) as TicketId;
  const validTicketIds = ticketOptions.map((ticket) => ticket.id);

  if (!name || !company || !title || !country || !city) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!applicantTypes.includes(applicantType)) {
    return NextResponse.json({ error: "Please select a valid applicant type." }, { status: 400 });
  }

  if (!validTicketIds.includes(selectedTicket)) {
    return NextResponse.json({ error: "Please select a valid program option." }, { status: 400 });
  }

  let order: Order | null = null;

  try {
    const application = await createApplication({
      userId: user.id,
      name,
      email: user.email,
      company,
      title,
      country,
      city,
      applicantType,
      selectedTicket,
      message,
    });
    order = await createOrderForApplication(application);
    const checkoutSession = await createStripeCheckoutSession(application, order);

    if (!checkoutSession.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    await updateOrder(order.id, {
      amount: checkoutSession.amount_total || order.amount,
      currency: checkoutSession.currency || order.currency,
      status: "checkout_created",
      checkoutUrl: checkoutSession.url,
      stripeCheckoutSessionId: checkoutSession.id,
      paymentLinkExpiresAt: checkoutSession.expires_at
        ? new Date(checkoutSession.expires_at * 1000).toISOString()
        : null,
    });
    await updateApplicationStatus(application.id, "payment_sent");

    return NextResponse.json(
      { applicationId: application.id, orderId: order.id, checkoutUrl: checkoutSession.url },
      { status: 201 },
    );
  } catch (error) {
    if (order) {
      await updateOrder(order.id, { status: "payment_failed" }).catch(() => undefined);
    }

    console.error("Unable to create application checkout", error);
    return NextResponse.json(
      { error: "We could not start secure checkout. Your application was saved; please try again from your account." },
      { status: 500 },
    );
  }
}
