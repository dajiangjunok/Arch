import { NextResponse } from "next/server";
import { isValidEmailAddress } from "@/lib/email";
import { ticketOptions } from "@/lib/tickets";
import {
  attachReferralToApplication,
  createApplication,
  deleteApplication,
} from "@/lib/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProgramWeek, TicketId } from "@/lib/types";
import { cookies } from "next/headers";

const programWeeks: ProgramWeek[] = ["week_1", "week_2", "week_3"];

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Sign in with a Google account that provides an email address before submitting an application." }, { status: 401 });
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "The application data is invalid." }, { status: 400 });
  }

  const name = readString(body.name);
  const contactEmail = readString(body.contactEmail).toLowerCase();
  const alternateContact = readString(body.alternateContact);
  const message = readString(body.message);
  const additionalInfo = readString(body.additionalInfo);
  const cookieStore = await cookies();
  const cookieReferralCode = cookieStore.get("arch_referral_code")?.value || "";
  const hasSubmittedReferralCode = Object.prototype.hasOwnProperty.call(body, "referralCode");
  const referralCode = hasSubmittedReferralCode ? readString(body.referralCode) : cookieReferralCode;
  const selectedTicket = readString(body.selectedTicket) as TicketId;
  const submittedWeeks = Array.isArray(body.selectedWeeks) ? body.selectedWeeks.map(readString) : [];
  const selectedWeeks = submittedWeeks.filter((week): week is ProgramWeek => programWeeks.includes(week as ProgramWeek));
  const validTicketIds = ticketOptions.map((ticket) => ticket.id);

  if (!name || !contactEmail || !alternateContact || !message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!isValidEmailAddress(contactEmail)) {
    return NextResponse.json({ error: "Please enter a valid contact email address." }, { status: 400 });
  }

  if (!validTicketIds.includes(selectedTicket)) {
    return NextResponse.json({ error: "Please select a valid program option." }, { status: 400 });
  }

  const uniqueSelectedWeeks = [...new Set(selectedWeeks)];

  if (selectedWeeks.length !== submittedWeeks.length) {
    return NextResponse.json({ error: "Please select a valid program week." }, { status: 400 });
  }

  if (selectedTicket === "fellowship" && uniqueSelectedWeeks.length !== 0) {
    return NextResponse.json({ error: "The Fellowship does not require a week selection." }, { status: 400 });
  }

  const expectedWeekCount = selectedTicket === "single_week"
    ? 1
    : selectedTicket === "two_weeks"
      ? 2
      : selectedTicket === "full_program"
        ? 3
        : 0;

  if (uniqueSelectedWeeks.length !== expectedWeekCount) {
    return NextResponse.json({ error: "Please select the week you want to attend." }, { status: 400 });
  }

  if (selectedTicket === "full_program" && !programWeeks.every((week) => uniqueSelectedWeeks.includes(week))) {
    return NextResponse.json({ error: "The full program includes all three weeks." }, { status: 400 });
  }

  try {
    const application = await createApplication({
      userId: user.id,
      name,
      email: contactEmail,
      selectedTicket,
      selectedWeeks: uniqueSelectedWeeks,
      alternateContact,
      message,
      additionalInfo,
    });

    const referral = referralCode
      ? await attachReferralToApplication({
          applicationId: application.id,
          userId: user.id,
          code: referralCode,
        })
      : null;

    if (referralCode && !referral) {
      await deleteApplication(application.id);
      return NextResponse.json({ error: "This invite code is invalid or expired." }, { status: 400 });
    }

    const response = NextResponse.json(
      { applicationId: application.id, status: application.status },
      { status: 201 },
    );
    response.cookies.delete("arch_referral_code");
    return response;
  } catch (error) {
    console.error("Unable to create application", error);
    return NextResponse.json(
      { error: "We could not submit your application. Please try again." },
      { status: 500 },
    );
  }
}
