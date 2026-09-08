import Link from "next/link";

export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Legal" className={`flex flex-wrap items-center gap-x-6 gap-y-3 text-xs ${className}`}>
      <Link href="/privacy" className="underline underline-offset-4 hover:text-marigold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        Privacy Policy
      </Link>
      <Link href="/terms" className="underline underline-offset-4 hover:text-marigold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        Terms of Service
      </Link>
    </nav>
  );
}
