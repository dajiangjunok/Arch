"use client";

import { useState } from "react";
import { ticketOptions } from "@/lib/tickets";
import type { ProgramWeek, TicketId } from "@/lib/types";

const weekOptions = [
  { value: "week_1", label: "Week 1" },
  { value: "week_2", label: "Week 2" },
  { value: "week_3", label: "Week 3" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ApplicationForm({
  email,
  defaultTicket = "single_week",
  defaultWeek = "week_1",
  referralCode = "",
}: {
  email: string;
  defaultTicket?: TicketId;
  defaultWeek?: ProgramWeek;
  referralCode?: string;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [inviteCode, setInviteCode] = useState(referralCode);
  const [selectedTicket, setSelectedTicket] = useState<TicketId>(defaultTicket);

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
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Best contact email" name="contactEmail" type="email" autoComplete="email" defaultValue={email} required />
      </div>

      <Field
        label="Alternate contact"
        name="alternateContact"
        placeholder="Phone, WhatsApp, WeChat, Telegram, or another reliable way to reach you"
        required
      />

      <label className="grid min-w-0 gap-2 border border-ink/20 bg-marigold/10 p-4">
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
          className="min-h-12 w-full min-w-0 rounded-none border border-ink/25 bg-ivory px-4 font-mono text-sm uppercase text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        />
      </label>

      <label className="grid min-w-0 gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
          Program option
        </span>
        <select
          name="selectedTicket"
          required
          value={selectedTicket}
          onChange={(event) => setSelectedTicket(event.target.value as TicketId)}
          className="min-h-12 w-full min-w-0 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        >
          {ticketOptions.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.label} - {ticket.priceLabel} - {ticket.description}
            </option>
          ))}
        </select>
      </label>

      {selectedTicket === "single_week" ? (
        <label className="grid min-w-0 gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            Which week do you want to attend?
          </span>
          <select
            name="selectedWeek"
            required
            defaultValue={defaultWeek}
            className="min-h-12 w-full min-w-0 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
          >
            {weekOptions.map((week) => (
              <option key={week.value} value={week.value}>
                {week.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="grid min-w-0 gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">Tell us about yourself and what you hope to get out of The Arch.</span>
        <textarea
          name="message"
          rows={6}
          required
          className="w-full min-w-0 resize-none rounded-none border border-ink/20 bg-ivory px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
          placeholder="Share your background, current work, and goals for joining."
        />
      </label>

      <label className="grid min-w-0 gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">Anything else we should know?</span>
        <textarea
          name="additionalInfo"
          rows={4}
          className="w-full min-w-0 resize-none rounded-none border border-ink/20 bg-ivory px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
          placeholder="Optional context, questions, accessibility needs, or scheduling constraints."
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
  autoComplete,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-12 w-full min-w-0 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
      />
    </label>
  );
}
