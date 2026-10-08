"use client";

import { useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export function UsersFiltersForm({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function navigate(href: string) {
    startTransition(() => {
      if (href === `${window.location.pathname}${window.location.search}`) {
        router.refresh();
      } else {
        router.push(href, { scroll: false });
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const data = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    for (const [name, value] of data) {
      if (typeof value === "string") query.set(name, value);
    }
    navigate(`/admin/users?${query}`);
  }

  return (
    <form action="/admin/users" method="get" onSubmit={handleSubmit} aria-busy={pending}
      className="mt-8 border border-line bg-paper p-5">
      <fieldset disabled={pending} className="flex min-w-0 flex-wrap items-end gap-4">
        {children}
        <button type="submit"
          className="inline-flex min-h-11 min-w-[150px] items-center justify-center gap-2 bg-ink px-5 text-sm font-semibold text-paper hover:bg-sun hover:text-ink disabled:cursor-wait disabled:opacity-70">
          {pending && <span aria-hidden="true" className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" />}
          {pending ? "Searching..." : "Search"}
        </button>
        <button type="button" onClick={(event) => {
          event.currentTarget.form?.reset();
          navigate("/admin/users");
        }}
          className="px-2 py-3 text-sm underline underline-offset-4 disabled:cursor-wait disabled:opacity-70">
          Reset
        </button>
      </fieldset>
      <p role="status" aria-live="polite" className="sr-only">{pending ? "Loading users. Please wait." : ""}</p>
    </form>
  );
}
