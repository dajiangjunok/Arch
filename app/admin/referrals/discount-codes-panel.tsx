import { SubmitButton } from "@/app/_components/submit-button";
import { CopyLinkButton } from "@/app/partner/_components/copy-link-button";
import { getSiteUrl } from "@/lib/stripe";
import type { Distributor, ReferralCode } from "@/lib/types";
import { updateDistributorDiscountAction } from "../actions";

export function DiscountCodesPanel({ distributors, codes, couponConfigured }: {
  distributors: Distributor[];
  codes: ReferralCode[];
  couponConfigured: boolean;
}) {
  // These fields are absent from existing rows until migration 017 is applied.
  const schemaReady = distributors.every((distributor) => typeof distributor.discountEnabled === "boolean")
    && codes.every((code) => code.kind === "referral" || code.kind === "discount");
  const siteUrl = getSiteUrl();

  return (
    <section id="discount-codes" aria-labelledby="discount-codes-heading" className="min-w-0 scroll-mt-6 border-2 border-navy bg-paper p-5 sm:p-6">
      <p className="label">Distributor offers</p>
      <h2 id="discount-codes-heading" className="mt-2 font-poster text-3xl uppercase tracking-[0.04em]">Discount codes</h2>
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        Enable a dedicated discount code for selected distributors. Each distributor decides which customers receive their discount code or link: $1,299 off the 1 Week program, from $9,799 to $8,500 USD. Their ordinary invite code continues to use standard pricing.
      </p>

      {!schemaReady || !couponConfigured ? (
        <div role="status" className="mt-5 space-y-2 border border-amber-700/30 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Setup required before enabling discount codes</p>
          {!schemaReady ? <p>Apply the database migration <code className="break-all">017_distributor_discount_codes.sql</code> in Supabase.</p> : null}
          {!couponConfigured ? <p>Configure <code className="break-all">STRIPE_COUPON_DISTRIBUTOR_1299</code> with your Stripe $1,299 Coupon ID, then restart the local server or redeploy.</p> : null}
        </div>
      ) : null}

      {distributors.length === 0 ? (
        <p className="mt-5 border border-dashed border-line p-5 text-sm text-ink-soft">Add a distributor below to enable their discount code.</p>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {distributors.map((distributor) => {
            const discountCode = codes.find((code) => code.distributorId === distributor.id && code.kind === "discount");
            const enabled = distributor.discountEnabled === true;
            const active = distributor.status === "active";
            const link = discountCode ? `${siteUrl}/r/${encodeURIComponent(discountCode.code)}` : null;
            return (
              <article key={distributor.id} className="min-w-0 border border-line bg-cloud p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold">{distributor.name}</h3>
                    {distributor.email ? <p className="mt-1 break-all text-xs text-ink-soft">{distributor.email}</p> : null}
                  </div>
                  <span className="border border-line bg-paper px-3 py-2 text-xs">{!active ? "Distributor inactive" : enabled ? "Discount enabled" : "Discount not enabled"}</span>
                </div>
                {discountCode ? (
                  <div className="mt-4 min-w-0">
                    <p className="text-xs text-ink-soft">Discount code · {discountCode.usedCount} applications</p>
                    <p className="mt-2 select-all break-all font-mono text-sm font-semibold text-navy">{discountCode.code}</p>
                    <p className="mt-2 select-all break-all text-xs text-ink-soft">{link}</p>
                  </div>
                ) : <p className="mt-4 text-sm text-ink-soft">Enable the discount to generate this distributor&apos;s code.</p>}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <form action={updateDistributorDiscountAction}>
                    <input type="hidden" name="distributorId" value={distributor.id} />
                    <input type="hidden" name="enabled" value={String(!enabled)} />
                    <SubmitButton pendingLabel="Updating..." className={enabled ? "min-h-11 border border-line bg-paper px-4 py-3 font-mono text-xs text-ink hover:border-ink" : "button-primary"}
                      disabled={!schemaReady || (!enabled && (!active || !couponConfigured))}>
                      {enabled ? "Disable discount" : "Enable $1,299 discount"}
                    </SubmitButton>
                  </form>
                  {link && enabled && active && discountCode?.status === "active" ? <CopyLinkButton value={link} label="Copy discount link · $8,500" /> : null}
                </div>
                {!active ? <p className="mt-3 text-xs text-ink-soft">Enable this distributor in the list below before offering discounts.</p> : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
