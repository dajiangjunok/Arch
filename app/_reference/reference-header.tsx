import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { AccountMenu } from "./account-menu";
import type { ReferencePageId } from "./types";

const links = [
  { id: "home", href: "/", label: "Home" },
  { id: "week1", href: "/week1", label: "Week 1" },
  { id: "week2", href: "/week2", label: "Week 2" },
  { id: "week3", href: "/week3", label: "Week 3" },
] as const;

export async function ReferenceHeader({ page }: { page: ReferencePageId }) {
  const user = await getCurrentUser();
  const email = user?.email || "";
  const metadataName =
    user?.user_metadata?.full_name || user?.user_metadata?.name;
  const displayName =
    (typeof metadataName === "string" && metadataName.trim()) ||
    email.split("@")[0] ||
    "Member";

  function renderAuthControl() {
    if (!user) {
      return (
        <Link className="signin-link" href="/login">
          <span>Sign in</span>
          <span className="signin-arrow" aria-hidden="true">
            ↗
          </span>
        </Link>
      );
    }

    return <AccountMenu email={email} displayName={displayName} />;
  }

  return (
    <div className="wrap reference-header">
      <nav className="top" aria-label="Main navigation">
        <Link className="brand" href="/">
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={34}
            className="brand-mark"
            priority
          />
          The Arch.
        </Link>
        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={page === link.id ? "active" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/apply">Apply</Link>
          <div className="desktop-auth">{renderAuthControl()}</div>
        </div>
        <div className="mobile-auth">{renderAuthControl()}</div>
      </nav>
    </div>
  );
}
