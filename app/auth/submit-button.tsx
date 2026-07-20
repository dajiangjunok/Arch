"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  pendingLabel: ReactNode;
};

export function SubmitButton({ children, pendingLabel, className = "", disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      {...props}
      type="submit"
      disabled={isDisabled}
      aria-busy={pending}
      className={`${className} disabled:cursor-wait disabled:pointer-events-none disabled:opacity-80`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {pending ? (
          <span
            aria-hidden="true"
            className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : null}
        <span>{pending ? pendingLabel : children}</span>
      </span>
    </button>
  );
}
