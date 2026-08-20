"use client";

import { useState } from "react";
import { ticketOptions } from "@/lib/tickets";
import type { TicketId } from "@/lib/types";

const applicantTypes = [
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Investor" },
  { value: "institution", label: "Institution" },
  { value: "partner", label: "China partner" },
  { value: "other", label: "Other" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ApplicationForm({
  email,
  defaultTicket = "single_week_pass",
  referralCode = "",
}: {
  email: string;
  defaultTicket?: TicketId;
  referralCode?: string;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [inviteCode, setInviteCode] = useState(referralCode);

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { error?: string; applicationId?: string; checkoutUrl?: string | null };

    if (!response.ok) {
      if (response.status === 401) {
        window.location.assign("/login?next=%2Fapply");
        return;
      }

      setStatus("error");
      setMessage(result.error || "Unable to submit the application.");
      return;
    }

    if (result.checkoutUrl) {
      window.location.assign(result.checkoutUrl);
      return;
    }

    setStatus("success");
    setMessage(
      inviteCode.trim()
        ? `Application submitted with invite code ${inviteCode.trim().toUpperCase()}. Your payment link will appear after review.`
        : "Application submitted for review. Your payment link will appear in your account after approval.",
    );
  }

  return (
    <form onSubmit={submitApplication} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <label className="grid gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">Account email</span>
          <input
            value={email}
            readOnly
            className="min-h-12 border border-ink/20 bg-ink/5 px-4 font-mono text-sm text-ink/70 outline-none"
          />
        </label>
        <Field label="Company" name="company" required />
        <Field label="Title" name="title" required />
        <Field label="Country" name="country" required />
        <Field label="City" name="city" required />
      </div>

      <label className="grid gap-2 border border-ink/20 bg-marigold/10 p-4">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            Invite / referral code (optional)
          </span>
          {referralCode && inviteCode === referralCode ? (
            <span className="border border-navy/20 bg-card px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-navy">
              From invite link
            </span>
          ) : null}
        </span>
        <input
          name="referralCode"
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
          autoComplete="off"
          maxLength={64}
          placeholder="Enter code"
          className="min-h-12 rounded-none border border-ink/25 bg-ivory px-4 font-mono text-sm uppercase text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        />
      </label>

      <label className="grid gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
          Applicant type
        </span>
        <select
          name="applicantType"
          required
          defaultValue="founder"
          className="min-h-12 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        >
          {applicantTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
          Program option
        </span>
        <select
          name="selectedTicket"
          required
          defaultValue={defaultTicket}
          className="min-h-12 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        >
          {ticketOptions.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.label} - {ticket.priceLabel} - {ticket.description}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">Message</span>
        <textarea
          name="message"
          rows={4}
          className="resize-none rounded-none border border-ink/20 bg-ivory px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
          placeholder="Share what you hope to explore in Shanghai."
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="mt-2 inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-marigold hover:text-ink focus:outline-none focus:ring-4 focus:ring-marigold/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting application" : status === "success" ? "Application submitted" : "Submit for review"}
      </button>

      {message ? (
        <p
          className={`border px-4 py-3 font-mono text-sm leading-6 ${
            status === "success"
              ? "border-ink/20 bg-ivory text-ink"
              : "border-red-700/30 bg-red-50 text-red-900"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="min-h-12 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
      />
    </label>
  );
}
