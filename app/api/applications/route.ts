import { NextResponse } from "next/server";
import { ticketOptions } from "@/lib/tickets";
import {
  attachReferralToApplication,
  createApplication,
  deleteApplication,
} from "@/lib/store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicantType, TicketId } from "@/lib/types";
import { cookies } from "next/headers";

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
    return NextResponse.json({ error: "Sign in with a Google account that provides an email address before submitting an application." }, { status: 401 });
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
  const cookieStore = await cookies();
  const cookieReferralCode = cookieStore.get("arch_referral_code")?.value || "";
  const hasSubmittedReferralCode = Object.prototype.hasOwnProperty.call(body, "referralCode");
  const referralCode = hasSubmittedReferralCode ? readString(body.referralCode) : cookieReferralCode;
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
