"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          theme: "light";
          size: "flexible";
          "response-field": boolean;
          "response-field-name": string;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileField({ siteKey, action }: { siteKey: string | null; action: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) return;

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme: "light",
      size: "flexible",
      "response-field": true,
      "response-field-name": "cf-turnstile-response",
    });

    return () => window.turnstile?.remove(widgetId);
  }, [action, scriptReady, siteKey]);

  if (!siteKey) {
    return (
      <p className="border border-red-800/30 bg-red-50 px-4 py-3 text-xs leading-5 text-red-900">
        Security verification is not configured. Contact the site administrator.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
        Security check
      </span>
      <div className="min-h-[65px] overflow-hidden border border-ink/15 bg-ivory p-1">
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
          onReady={() => setScriptReady(true)}
        />
        <div ref={containerRef} />
      </div>
    </div>
  );
}
