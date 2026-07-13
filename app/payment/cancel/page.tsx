import Link from "next/link";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-5 py-12 text-ink">
      <section className="w-full max-w-2xl border border-ink bg-card p-6 shadow-ink sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-sun">Payment canceled</p>
        <h1 className="mt-4 font-poster text-[clamp(3rem,10vw,6rem)] uppercase leading-none tracking-[0.08em]">
          Checkout closed
        </h1>
        <p className="mt-6 text-base leading-8 text-ink-soft">
          No payment was recorded. You can use the payment link again while it remains active, or contact the Arch.ai
          team for a new link.
        </p>
        {params.order_id ? <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">Your order remains in your account</p> : null}
        <Link
          href="/account"
          className="mt-8 inline-flex rounded-md bg-navy px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ivory hover:bg-marigold hover:text-ink"
        >
          View my account
        </Link>
      </section>
    </main>
  );
}
