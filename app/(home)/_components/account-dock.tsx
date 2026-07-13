import { logoutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";

export async function AccountDock() {
  const user = await getCurrentUser();

  return (
    <aside aria-label="Account" className="fixed right-4 top-4 z-[70] sm:right-6 sm:top-6">
      <div className="flex min-h-10 max-w-[calc(100vw-2rem)] items-stretch border border-ink/20 bg-ivory text-ink">
        {user ? (
          <>
            <span className="my-auto ml-3 h-1.5 w-1.5 shrink-0 bg-marigold" aria-hidden="true" />
            <a
              href="/account"
              title={user.email || "My account"}
              className="flex max-w-44 items-center truncate px-3 font-mono text-[10px] text-navy transition hover:bg-card sm:max-w-64"
            >
              {user.email || "My account"}
            </a>
            <form action={logoutAction} className="flex border-l border-ink/15">
              <button className="px-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/55 transition hover:bg-navy hover:text-ivory">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="flex items-center bg-navy px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition hover:bg-marigold hover:text-ink"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="flex items-center border-l border-ink/15 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-navy transition hover:bg-card"
            >
              Register
            </a>
          </>
        )}
      </div>
    </aside>
  );
}
