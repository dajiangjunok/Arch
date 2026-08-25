"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/auth/actions";
import type { getUserIdentity } from "@/lib/user-identity";
import { SubmitButton } from "@/app/_components/submit-button";

type UserIdentity = ReturnType<typeof getUserIdentity>;

export function AccountMenu({ identity, isAdmin = false }: { identity: UserIdentity; isAdmin?: boolean }) {
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
        aria-label={`Signed in as ${identity.email || identity.displayName}`}
        onClick={() => setOpen((current) => !current)}
      >
        <AccountAvatar identity={identity} compact />
        <span className="account-copy">
          <span className="account-state">Signed in</span>
          <span className="account-name">{identity.displayName}</span>
        </span>
        <span className="account-chevron" aria-hidden="true">
          ↓
        </span>
      </button>

      <div className="account-popover" role="menu">
        <div className="account-identity">
          <AccountAvatar identity={identity} />
          <span className="account-identity-copy">
            <strong>{identity.displayName}</strong>
            <span>{identity.email || "Google account"}</span>
          </span>
        </div>
        <div className="account-actions">
          <Link href="/account" className="account-action" role="menuitem">
            <span>My account</span>
            <span aria-hidden="true">↗</span>
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="account-action" role="menuitem">
              <span>Admin dashboard</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
          <form action={logoutAction}>
            <SubmitButton
              className="account-action account-signout"
              pendingLabel="Signing out..."
              role="menuitem"
            >
              <span>Sign out</span>
              <span aria-hidden="true">→</span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}

function AccountAvatar({ identity, compact = false }: { identity: UserIdentity; compact?: boolean }) {
  const className = compact ? "account-avatar account-avatar-compact" : "account-avatar";

  if (identity.avatarUrl) {
    return <img className={className} src={identity.avatarUrl} alt="" referrerPolicy="no-referrer" />;
  }

  return (
    <span className={className} aria-hidden="true">
      {identity.initials}
    </span>
  );
}
