"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isValidEmailAddress } from "@/lib/email";
import { DiscountSummary } from "@/app/_components/discount-summary";
import { normalizeReferralCode, type CodeQuote } from "@/lib/discounts";
import { getTicket, ticketOptions } from "@/lib/tickets";
import type { ProgramWeek, TicketId } from "@/lib/types";

const weekOptions = [
  { value: "week_1", label: "Week 1" },
  { value: "week_2", label: "Week 2" },
  { value: "week_3", label: "Week 3" },
];

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
  const [requestedCode, setRequestedCode] = useState(normalizeReferralCode(referralCode));
  const [codeQuote, setCodeQuote] = useState<CodeQuote | null>(null);
  const [codeError, setCodeError] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [checkAttempt, setCheckAttempt] = useState(0);
  const initialTicket = defaultTicket === "fellowship" ? "fellowship_single_week" : defaultTicket;
  const [selectedTicket, setSelectedTicket] = useState<TicketId>(initialTicket);
  const [selectedWeeks, setSelectedWeeks] = useState<ProgramWeek[]>(
    getTicket(initialTicket).weekCount === 3
      ? weekOptions.map((week) => week.value as ProgramWeek)
      : [defaultWeek],
  );
  const currentTicket = getTicket(selectedTicket);
  const programTicketOptions = ticketOptions.filter((ticket) => ticket.program === currentTicket.program);

  const normalizedCode = normalizeReferralCode(inviteCode);
  const appliedQuote = codeQuote?.code === normalizedCode && codeQuote.selectedTicket === selectedTicket ? codeQuote : null;

  useEffect(() => {
    setCodeQuote(null);
    setCodeError("");
    setCheckingCode(false);
    if (!requestedCode || normalizedCode !== requestedCode) return;
    const controller = new AbortController();
    setCheckingCode(true);
    async function checkCode() {
      try {
        const response = await fetch("/api/applications/code", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: requestedCode, selectedTicket }), signal: controller.signal,
        });
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) {
          setCodeError(result.error || "Unable to apply this code.");
          return;
        }
        setCodeQuote(result as CodeQuote);
      } catch {
        if (!controller.signal.aborted) setCodeError("Unable to verify this code. Please try again.");
      } finally {
        if (!controller.signal.aborted) setCheckingCode(false);
      }
    }
    void checkCode();
    return () => controller.abort();
  }, [normalizedCode, requestedCode, selectedTicket, checkAttempt]);

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

  function changeTicket(ticket: TicketId) {
    setSelectedTicket(ticket);
    const weekCount = getTicket(ticket).weekCount;
    if (weekCount === 1) setSelectedWeeks((weeks) => [weeks[0] || defaultWeek]);
    if (weekCount === 2) {
      setSelectedWeeks((weeks) => weeks.length ? weeks.slice(0, 2) : [defaultWeek]);
    }
    if (weekCount === 3) setSelectedWeeks(weekOptions.map((week) => week.value as ProgramWeek));
  }

  function changeProgramOption(option: ProgramOption) {
    const ticket = ticketOptions.find((ticket) => ticket.program === option && ticket.weekCount === currentTicket.weekCount)!;
    changeTicket(ticket.id);
  }

  function toggleWeek(week: ProgramWeek) {
    if (currentTicket.weekCount === 1) {
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

    if (normalizedCode && !appliedQuote) {
      setCodeError("Apply your code successfully before submitting, or clear it to continue without a code.");
      return;
    }
    if (selectedWeeks.length !== currentTicket.weekCount) {
      setStatus("error");
      setMessage(`Please select exactly ${currentTicket.weekCount} different program week(s).`);
      return;
    }
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(formData.entries()), selectedWeeks };
    try {
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
          ? `Application submitted with code ${inviteCode.trim().toUpperCase()}. Your payment link will appear after review.`
          : "Application submitted for review. Your payment link will appear in your account after approval.",
      );
    } catch {
      setStatus("error");
      setMessage("Unable to submit the application. Please check your connection and try again.");
    }
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


      <label className="grid min-w-0 gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
          Program option
        </span>
        <select
          name="programOption"
          required
          value={currentTicket.program}
          onChange={(event) => changeProgramOption(event.target.value as ProgramOption)}
          className="min-h-12 w-full min-w-0 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        >
          <option value="single_week_access">Single Week Access</option>
          <option value="fellowship">Fellowship</option>
        </select>
      </label>

      <label className="grid min-w-0 gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
          Choose your duration
        </span>
        <select
          name="selectedTicket"
          required
          value={selectedTicket}
          onChange={(event) => changeTicket(event.target.value as TicketId)}
          className="min-h-12 w-full min-w-0 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        >
          {programTicketOptions.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.label} - {ticket.priceLabel} - {ticket.description}
            </option>
          ))}
        </select>
      </label>

      {currentTicket.weekCount < 3 ? (
        <fieldset className="grid min-w-0 gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            {currentTicket.weekCount === 1 ? "Which week would you like to attend?" : "Which weeks would you like to attend?"}
          </span>
          <div className="grid gap-2 sm:grid-cols-3">
            {weekOptions.map((week) => (
              <label key={week.value} className="flex min-h-12 cursor-pointer items-center gap-3 border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-ivory">
                <input type={currentTicket.weekCount === 1 ? "radio" : "checkbox"} name="programWeek" value={week.value} checked={selectedWeeks.includes(week.value as ProgramWeek)} onChange={() => toggleWeek(week.value as ProgramWeek)} className="accent-current" />
                {week.label}
              </label>
            ))}
          </div>
          {currentTicket.weekCount === 2 ? <span className="text-xs text-ink/65">Select exactly 2 weeks ({selectedWeeks.length}/2 selected).</span> : null}
        </fieldset>
      ) : null}

      <div className="grid min-w-0 gap-2 border border-ink/20 bg-marigold/10 p-4">
        <label htmlFor="application-code" className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
          Invite / discount code (optional)
        </label>
        {referralCode && normalizedCode === normalizeReferralCode(referralCode) ? <p className="text-xs text-ink-soft">From your partner link</p> : null}
        <div className="flex flex-wrap gap-2">
          <input id="application-code" name="referralCode" value={inviteCode}
            onChange={(event) => { setInviteCode(event.target.value.toUpperCase()); setRequestedCode(""); setCodeQuote(null); }}
            autoComplete="off" maxLength={64} placeholder="Enter code"
            disabled={status === "submitting" || status === "success"}
            aria-describedby="application-code-status"
            className="min-h-12 min-w-0 flex-1 border border-ink/25 bg-ivory px-4 font-mono text-sm uppercase outline-none focus:ring-4 focus:ring-marigold/25" />
          <button type="button" disabled={!normalizedCode || checkingCode || status === "submitting" || status === "success"}
            onClick={() => { setRequestedCode(normalizedCode); setCheckAttempt((attempt) => attempt + 1); }}
            className="min-h-12 bg-navy px-5 font-mono text-xs text-ivory disabled:opacity-50">
            {checkingCode ? "Checking…" : "Apply"}
          </button>
          {inviteCode ? <button type="button" disabled={status === "submitting" || status === "success"}
            onClick={() => { setInviteCode(""); setRequestedCode(""); setCodeQuote(null); }}
            className="px-2 text-xs underline">Remove</button> : null}
        </div>
        <div id="application-code-status" aria-live="polite">
          {codeError ? <p className="text-sm text-red-800">{codeError}</p> : null}
          {appliedQuote ? <p className="text-sm text-emerald-800">{appliedQuote.kind === "discount" ? "Discount applied. Your partner referral is included." : "Invite code applied. This code records your partner referral without a price discount."}</p> : null}
        </div>
        {appliedQuote?.kind === "discount" ? <DiscountSummary code={appliedQuote.code}
          originalAmount={appliedQuote.originalAmount!} discountAmount={appliedQuote.discountAmount}
          amountDue={appliedQuote.amountDue!} currency={appliedQuote.currency} /> : null}
        {appliedQuote?.kind === "discount" ? <p className="text-xs text-ink-soft">Payment is requested after review. This price is saved when you submit your application.</p> : null}
      </div>

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

      <p className="text-xs leading-6 text-ink/70">
        By submitting, you agree to The Arch&apos;s{" "}
        <Link href="/terms" className="text-navy underline underline-offset-4">Terms of Service</Link>
        {" "}and acknowledge the{" "}
        <Link href="/privacy" className="text-navy underline underline-offset-4">Privacy Policy</Link>.
        {inviteCode.trim() ? " If you use an invite or discount code, the referring partner can see your name, contact email, selected program, application and payment status, program price, discount, paid and refunded amounts, and submission date. Clear the code above if you do not want this attribution." : ""}
      </p>

      <button
        type="submit"
        disabled={status === "submitting" || status === "success" || checkingCode}
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
