import Link from "next/link";
import { logoutAction } from "./actions";
import { SubmitButton } from "@/app/_components/submit-button";

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <main className="mx-auto min-h-screen max-w-[1500px] px-5 py-6 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="font-poster text-4xl tracking-[0.16em]">
            Arch<span className="text-sun">.</span>ai
          </Link>
          <h1 className="mt-4 font-poster text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-none tracking-[0.08em]">
            {title}
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
          <Link className="border border-line bg-paper px-4 py-3 hover:border-ink" href="/admin/applications">
            Applications
          </Link>
          <Link className="border border-line bg-paper px-4 py-3 hover:border-ink" href="/admin/orders">
            Orders
          </Link>
          <Link className="border border-line bg-paper px-4 py-3 hover:border-ink" href="/admin/refunds">
            Refunds
          </Link>
          <Link className="border border-line bg-paper px-4 py-3 hover:border-ink" href="/admin/referrals">
            Referrals
          </Link>
          <form action={logoutAction}>
            <SubmitButton pendingLabel="Signing out..." className="border border-line bg-ink px-4 py-3 text-paper hover:bg-sun hover:text-ink">
              Sign out
            </SubmitButton>
          </form>
        </nav>
      </header>
      {children}
    </main>
  );
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit border border-line bg-paper px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
      {children}
    </span>
  );
}

export function Notice({ notice, error }: { notice?: string; error?: string }) {
  if (!notice && !error) {
    return null;
  }

  return (
    <div
      className={`mt-6 border px-4 py-3 text-sm ${
        error ? "border-red-700/30 bg-red-50 text-red-900" : "border-ink/20 bg-paper text-ink"
      }`}
    >
      {error || notice}
    </div>
  );
}
