"use client";

import { useState } from "react";
import { ticketOptions } from "@/lib/tickets";

const applicantTypes = [
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Investor" },
  { value: "institution", label: "Institution" },
  { value: "partner", label: "China partner" },
  { value: "other", label: "Other" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ApplicationForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

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
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error || "Unable to submit the application.");
      return;
    }

    event.currentTarget.reset();
    setStatus("success");
    setMessage("Application received. Our team will review it and send payment instructions if approved.");
  }

  return (
    <form onSubmit={submitApplication} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" required type="email" />
        <Field label="Company" name="company" required />
        <Field label="Title" name="title" required />
        <Field label="Country" name="country" required />
        <Field label="City" name="city" required />
      </div>

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
          defaultValue="full_program"
          className="min-h-12 rounded-none border border-ink/20 bg-ivory px-4 font-mono text-sm text-ink outline-none focus:border-ink focus:ring-4 focus:ring-marigold/25"
        >
          {ticketOptions.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.label} - {ticket.description}
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
        disabled={status === "submitting"}
        className="mt-2 inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-marigold hover:text-ink focus:outline-none focus:ring-4 focus:ring-marigold/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending" : "Submit application"}
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
