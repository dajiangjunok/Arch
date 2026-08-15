"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/auth/actions";

export function AccountMenu({
  email,
  displayName,
}: {
  email: string;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeFromOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [open]);

  return (
    <div ref={menuRef} className={`account-menu${open ? " is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="account-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Signed in as ${email || displayName}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="account-copy">
          <span className="account-state">Signed in</span>
          <span className="account-name">{displayName}</span>
        </span>
        <span className="account-chevron" aria-hidden="true">
          ↓
        </span>
      </button>

      <div className="account-popover" role="menu">
        <div className="account-identity">
          <span className="account-identity-copy">
            <strong>{displayName}</strong>
            <span>{email}</span>
          </span>
        </div>
        <div className="account-actions">
          <Link href="/account" className="account-action" role="menuitem">
            <span>My account</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <form action={logoutAction}>
            <button
              className="account-action account-signout"
              type="submit"
              role="menuitem"
            >
              <span>Sign out</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
