import { formatMoney } from "@/lib/format";

export function DiscountSummary({ code, originalAmount, discountAmount, amountDue, currency = "usd" }: {
  code: string;
  originalAmount: number;
  discountAmount: number;
  amountDue: number;
  currency?: string;
}) {
  return (
    <div className="mt-4 border border-navy/20 bg-marigold/10 p-4 text-sm">
      <p className="mb-3 break-all font-mono text-xs text-navy">Discount code: {code}</p>
      <dl className="grid grid-cols-2 gap-2">
        <dt>Original price</dt><dd className="text-right">{formatMoney(originalAmount, currency)}</dd>
        <dt>Distributor discount</dt><dd className="text-right">−{formatMoney(discountAmount, currency)}</dd>
        <dt className="border-t border-ink/20 pt-2 font-semibold">Program total</dt>
        <dd className="border-t border-ink/20 pt-2 text-right font-semibold">{formatMoney(amountDue, currency)}</dd>
      </dl>
    </div>
  );
}
