import Link from "next/link";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-12 text-ink">
      <section className="w-full max-w-2xl border border-line bg-cloud p-6 shadow-ticket sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-sun">Payment canceled</p>
        <h1 className="mt-4 font-poster text-[clamp(3rem,10vw,6rem)] uppercase leading-none tracking-[0.08em]">
          Checkout closed
        </h1>
        <p className="mt-6 text-base leading-8 text-ink-soft">
          No payment was recorded. You can use the payment link again while it remains active, or contact the Arch.ai
          team for a new link.
        </p>
        {params.order_id ? (
          <p className="mt-5 break-all border border-line bg-paper p-4 font-mono text-xs text-ink-soft">
            Order {params.order_id}
          </p>
        ) : null}
        <Link
          href="/"
          className="mt-8 inline-flex bg-ink px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.24em] text-paper hover:bg-sun hover:text-ink"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
