"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isValidEmailAddress } from "@/lib/email";
import { ticketOptions } from "@/lib/tickets";
import type { ProgramWeek, TicketId } from "@/lib/types";

const weekOptions = [
  { value: "week_1", label: "Week 1" },
  { value: "week_2", label: "Week 2" },
  { value: "week_3", label: "Week 3" },
];

const accessTicketOptions = ticketOptions.filter((ticket) => ticket.id !== "fellowship");

type AccessTicketId = Exclude<TicketId, "fellowship">;
type ProgramOption = "single_week_access" | "fellowship";

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
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const [emailError, setEmailError] = useState("");
  const [inviteCode, setInviteCode] = useState(referralCode);
  const [selectedTicket, setSelectedTicket] = useState<TicketId>(defaultTicket);
  const [lastAccessTicket, setLastAccessTicket] = useState<AccessTicketId>(
    defaultTicket === "fellowship" ? "single_week" : defaultTicket,
  );
  const [selectedWeeks, setSelectedWeeks] = useState<ProgramWeek[]>(
    defaultTicket === "fellowship"
      ? []
      : defaultTicket === "full_program"
        ? weekOptions.map((week) => week.value as ProgramWeek)
        : [defaultWeek],
  );

  useEffect(() => {
    if (status !== "success") return;

    setRedirectCountdown(4);
    const countdownTimer = window.setInterval(() => {
      setRedirectCountdown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    const redirectTimer = window.setTimeout(() => {
      window.location.assign("/account");
    }, 4000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [status]);

  function validateEmail(input: HTMLInputElement) {
    const value = input.value.trim();
    const error = !value
      ? "Please enter your best contact email."
      : !isValidEmailAddress(value)
        ? "Please enter a valid email address."
        : "";
    setEmailError(error);
    return !error;
  }

  function changeTicket(ticket: AccessTicketId) {
    setSelectedTicket(ticket);
    setLastAccessTicket(ticket);
    if (ticket === "single_week") setSelectedWeeks((weeks) => [weeks[0] || defaultWeek]);
    if (ticket === "two_weeks") {
      setSelectedWeeks((weeks) => weeks.length ? weeks.slice(0, 2) : [defaultWeek]);
    }
    if (ticket === "full_program") setSelectedWeeks(weekOptions.map((week) => week.value as ProgramWeek));
  }

  function changeProgramOption(option: ProgramOption) {
    if (option === "fellowship") {
      setSelectedTicket("fellowship");
      setSelectedWeeks([]);
      return;
    }

    changeTicket(lastAccessTicket);
  }

  function toggleWeek(week: ProgramWeek) {
    if (selectedTicket === "single_week") {
      setSelectedWeeks([week]);
      return;
    }
    setSelectedWeeks((weeks) =>
      weeks.includes(week) ? weeks.filter((item) => item !== week) : weeks.length < 2 ? [...weeks, week] : weeks,
    );
  }

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const contactEmailInput = event.currentTarget.elements.namedItem("contactEmail");
    if (contactEmailInput instanceof HTMLInputElement && !validateEmail(contactEmailInput)) {
      contactEmailInput.focus();
      return;
    }

    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(formData.entries()), selectedWeeks };
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
        <Field
          label="Best contact email"
          name="contactEmail"
          type="email"
          autoComplete="email"
          defaultValue={email}
          maxLength={254}
          required
          error={emailError}
          onBlur={(event) => validateEmail(event.currentTarget)}
          onChange={(event) => {
            if (emailError) validateEmail(event.currentTarget);
          }}
          onInvalid={(event) => {
            event.preventDefault();
            validateEmail(event.currentTarget);
            event.currentTarget.focus();
          }}
        />
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
          name="programOption"
          required
          value={selectedTicket === "fellowship" ? "fellowship" : "single_week_access"}
          onChange={(event) => changeProgramOption(event.target.value as ProgramOption)}
          className="min-h-12 w-full min-w-0 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        >
          <option value="single_week_access">Single Week Access</option>
          <option value="fellowship">Fellowship</option>
        </select>
      </label>

      {selectedTicket === "fellowship" ? (
        <input type="hidden" name="selectedTicket" value="fellowship" />
      ) : (
        <label className="grid min-w-0 gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            Choose Your Week
          </span>
          <select
            name="selectedTicket"
            required
            value={selectedTicket}
            onChange={(event) => changeTicket(event.target.value as AccessTicketId)}
            className="min-h-12 w-full min-w-0 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
          >
            {accessTicketOptions.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.label} - {ticket.description}
              </option>
            ))}
          </select>
        </label>
      )}

      {selectedTicket !== "full_program" && selectedTicket !== "fellowship" ? (
        <fieldset className="grid min-w-0 gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            {selectedTicket === "single_week" ? "Which week would you like to attend?" : "Which weeks would you like to attend?"}
          </span>
          <div className="grid gap-2 sm:grid-cols-3">
            {weekOptions.map((week) => (
              <label key={week.value} className="flex min-h-12 cursor-pointer items-center gap-3 border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-ivory">
                <input type={selectedTicket === "single_week" ? "radio" : "checkbox"} checked={selectedWeeks.includes(week.value as ProgramWeek)} onChange={() => toggleWeek(week.value as ProgramWeek)} className="accent-current" />
                {week.label}
              </label>
            ))}
          </div>
          {selectedTicket === "two_weeks" ? <span className="text-xs text-ink/65">Select exactly 2 weeks ({selectedWeeks.length}/2 selected).</span> : null}
        </fieldset>
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
        aria-busy={status === "submitting"}
        className="mt-2 inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-marigold hover:text-ink focus:outline-none focus:ring-4 focus:ring-marigold/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
            Submitting application
          </span>
        ) : status === "success" ? "Application submitted" : "Submit for review"}
      </button>

      {message && status === "success" ? (
        <div role="status" aria-live="polite" className="border-2 border-emerald-700 bg-emerald-50 px-5 py-5 text-emerald-950 shadow-[6px_6px_0_0_#047857]">
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xl font-bold text-white">✓</span>
            <div>
              <p className="font-serif text-xl font-bold text-emerald-900">Application submitted successfully!</p>
              <p className="mt-1 text-sm leading-6">{message}</p>
              <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                Redirecting to My account in {redirectCountdown} seconds…
              </p>
              <Link href="/account" className="mt-3 inline-flex border border-emerald-800 bg-emerald-800 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-emerald-950">
                Go to My account now
              </Link>
            </div>
          </div>
        </div>
      ) : message ? (
        <p role="alert" className="border border-red-700/30 bg-red-50 px-4 py-3 font-mono text-sm leading-6 text-red-900">
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
  maxLength,
  placeholder,
  error,
  onBlur,
  onChange,
  onInvalid,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  maxLength?: number;
  placeholder?: string;
  error?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInvalid?: React.FormEventHandler<HTMLInputElement>;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="grid min-w-0 gap-2">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onBlur={onBlur}
        onChange={onChange}
        onInvalid={onInvalid}
        className={`min-h-12 w-full min-w-0 rounded-none border bg-ivory px-4 font-mono text-sm text-ink outline-none focus:ring-4 ${error ? "border-red-700 focus:border-red-700 focus:ring-red-700/20" : "border-ink/20 focus:border-ink focus:ring-marigold/25"}`}
      />
      {error ? <span id={errorId} role="alert" className="text-xs leading-5 text-red-800">{error}</span> : null}
    </label>
  );
}
