import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-auth";
import { logoutAction } from "@/app/auth/actions";
import { SubmitButton } from "@/app/_components/submit-button";

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=%2Fadmin");

  const session = await getAdminSession();
  if (session) redirect("/admin/applications");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md border border-line bg-paper p-6 text-center shadow-ticket sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-sun">Arch.ai admin</p>
        <h1 className="mt-4 font-poster text-5xl uppercase leading-none tracking-[0.08em]">Access denied</h1>
        <p className="mt-6 text-sm leading-7 text-ink-soft">
          {user.email} is signed in, but this account does not have the admin role.
        </p>
        <form action={logoutAction} className="mt-8">
          <SubmitButton pendingLabel="Signing out..." className="min-h-12 bg-ink px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.24em] text-paper transition hover:bg-sun hover:text-ink focus:outline-none focus:ring-4 focus:ring-sun/40">
            Sign in with another account
          </SubmitButton>
        </form>
      </section>
    </main>
  );
}
