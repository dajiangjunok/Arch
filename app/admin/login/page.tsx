import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { loginAction } from "../actions";
import { SubmitButton } from "@/app/_components/submit-button";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  const params = await searchParams;

  if (session) {
    redirect("/admin/applications");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md border border-line bg-paper p-6 shadow-ticket sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-sun">Arch.ai admin</p>
        <h1 className="mt-4 font-poster text-5xl uppercase leading-none tracking-[0.08em]">Sign in</h1>
        <form action={loginAction} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">Email</span>
            <input
              name="email"
              type="email"
              required
              className="min-h-12 border border-line bg-cloud px-4 text-sm outline-none focus:border-ink focus:ring-4 focus:ring-sun/25"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              className="min-h-12 border border-line bg-cloud px-4 text-sm outline-none focus:border-ink focus:ring-4 focus:ring-sun/25"
            />
          </label>
          {params.error ? <p className="border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-900">{params.error}</p> : null}
          <SubmitButton pendingLabel="Signing in..." className="mt-2 min-h-12 bg-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.24em] text-paper transition hover:bg-sun hover:text-ink focus:outline-none focus:ring-4 focus:ring-sun/40">
            Sign in
          </SubmitButton>
        </form>
      </section>
    </main>
  );
}
