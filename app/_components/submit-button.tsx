"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  pendingLabel?: ReactNode;
};

export function SubmitButton({ children, pendingLabel = "Loading...", className = "", disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={`${className} disabled:pointer-events-none disabled:cursor-wait disabled:opacity-70`}
    >
      <span className="inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap">
        {pending ? (
          <span aria-hidden="true" className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : null}
        <span>{pending ? pendingLabel : children}</span>
      </span>
    </button>
  );
}
