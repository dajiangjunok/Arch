"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type UsersPaginationProps = {
  page: number;
  pageCount: number;
  previousHref: string | null;
  nextHref: string | null;
};

export function UsersPagination({ page, pageCount, previousHref, nextHref }: UsersPaginationProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [direction, setDirection] = useState<"previous" | "next" | null>(null);

  function navigate(href: string | null, target: "previous" | "next") {
    if (!href || pending) return;
    setDirection(target);
    startTransition(() => router.push(href, { scroll: false }));
  }

  const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 border border-line bg-paper px-4 py-3 hover:border-ink disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <nav aria-label="Users pagination" aria-busy={pending} className="mt-5 flex items-center justify-between gap-4 text-sm">
      <button type="button" disabled={pending || !previousHref} onClick={() => navigate(previousHref, "previous")} className={buttonClass}>
        {pending && direction === "previous" && <Spinner />}
        Previous
      </button>
      <span role="status" aria-live="polite" className="text-center">
        {pending ? `Loading page ${direction === "previous" ? page - 1 : page + 1}...` : `${page} / ${pageCount}`}
      </span>
      <button type="button" disabled={pending || !nextHref} onClick={() => navigate(nextHref, "next")} className={buttonClass}>
        {pending && direction === "next" && <Spinner />}
        Next
      </button>
    </nav>
  );
}

function Spinner() {
  return <span aria-hidden="true" className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" />;
}
