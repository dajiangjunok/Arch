import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";
import type { ReferencePageId } from "./generated/reference-pages";

const links = [
  { id: "home", href: "/", label: "Home" },
  { id: "week1", href: "/week1", label: "Week 1" },
  { id: "week2", href: "/week2", label: "Week 2" },
  { id: "week3", href: "/week3", label: "Week 3" },
] as const;

export async function ReferenceHeader({ page }: { page: ReferencePageId }) {
  const user = await getCurrentUser();

  const authControl = user ? (
    <>
      <Link className="auth-link" href="/account" title={user.email || "My account"}>Account</Link>
      <form action={logoutAction} className="auth-form">
        <button className="auth-button" type="submit">Sign out</button>
      </form>
    </>
  ) : (
    <Link className="auth-link" href="/login">Sign in</Link>
  );

  return (
    <div className="wrap">
      <nav className="top" aria-label="Main navigation">
        <Link className="brand" href="/">
          <Image src="/logo.png" alt="" width={28} height={34} className="brand-mark" priority />
          The Arch.
        </Link>
        <div className="nav-links">
          {links.map((link) => (
            <Link key={link.id} href={link.href} className={page === link.id ? "active" : undefined}>
              {link.label}
            </Link>
          ))}
          <Link href="/apply">Apply</Link>
          <div className="desktop-auth">{authControl}</div>
        </div>
        <div className="mobile-auth">{authControl}</div>
      </nav>
    </div>
  );
}
