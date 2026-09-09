import { NextResponse } from "next/server";
import { ReferralCodeError } from "@/lib/discounts";
import { getApplicationCodeQuote } from "@/lib/referral-pricing";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ticketOptions } from "@/lib/tickets";
import type { TicketId } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Sign in before applying a code." }, { status: 401 });
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid code request." }, { status: 400 });
  }
  if (!body || typeof body.code !== "string" || !ticketOptions.some((ticket) => ticket.id === body.selectedTicket)) {
    return NextResponse.json({ error: "Enter a code and select a program." }, { status: 400 });
  }
  try {
    const { quote } = await getApplicationCodeQuote(body.code, body.selectedTicket as TicketId);
    return NextResponse.json(quote, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ReferralCodeError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Unable to validate application code", error);
    return NextResponse.json({ error: "We could not verify this code. Please try again or contact the Arch. team." }, { status: 503 });
  }
}
