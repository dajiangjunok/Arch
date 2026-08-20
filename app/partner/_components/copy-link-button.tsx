"use client";

import { useState } from "react";

export function CopyLinkButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy referral link"
      className="min-h-10 border border-navy px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-navy transition hover:bg-navy hover:text-ivory focus:outline-none focus:ring-4 focus:ring-marigold/30"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
