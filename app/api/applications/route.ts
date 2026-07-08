import { NextResponse } from "next/server";
import { ticketOptions } from "@/lib/tickets";
import { createApplication } from "@/lib/store";
import type { ApplicantType, TicketId } from "@/lib/types";

const applicantTypes: ApplicantType[] = ["founder", "investor", "institution", "partner", "other"];

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = readString(body.name);
  const email = readString(body.email).toLowerCase();
  const company = readString(body.company);
  const title = readString(body.title);
  const country = readString(body.country);
  const city = readString(body.city);
  const message = readString(body.message);
  const applicantType = readString(body.applicantType) as ApplicantType;
  const selectedTicket = readString(body.selectedTicket) as TicketId;
  const validTicketIds = ticketOptions.map((ticket) => ticket.id);

  if (!name || !email || !company || !title || !country || !city) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!applicantTypes.includes(applicantType)) {
    return NextResponse.json({ error: "Please select a valid applicant type." }, { status: 400 });
  }

  if (!validTicketIds.includes(selectedTicket)) {
    return NextResponse.json({ error: "Please select a valid program option." }, { status: 400 });
  }

  const application = await createApplication({
    name,
    email,
    company,
    title,
    country,
    city,
    applicantType,
    selectedTicket,
    message,
  });

  return NextResponse.json({ applicationId: application.id, status: application.status }, { status: 201 });
}
