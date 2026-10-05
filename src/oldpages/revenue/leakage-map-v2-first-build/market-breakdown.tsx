import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageReportMarketDto } from "@/services/api/leakage/get-leakage-report";

// `marketOptionLabel` (filters.ts) falls back to a generic "Unlabeled market"/"Primary market" for
// the filter dropdown, where currency isn't otherwise on screen. Here the currency already prints
// next to the amount, but with no `countryCode` (confirmed live 2026-09-24: every market but the
// primary NGN one had `countryCode: null`) that fallback text would repeat across the whole list,
// leaving nothing to tell the rows apart — so this uses the currency itself as the label instead.
function marketRowLabel(market: LeakageReportMarketDto): string {
  const name = market.countryCode ?? market.currency;
  return market.isPrimary ? `${name} · primary` : name;
}

function MarketRow({ market }: { market: LeakageReportMarketDto }) {
  const gross = market.gross.value;

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-t border-line py-2 first:border-0 first:pt-0">
      <p className="text-[13px] font-semibold text-ink">{marketRowLabel(market)}</p>
      <p className="text-[13px] font-semibold text-ink">
        {gross !== null ? formatCompactMoney(gross, market.currency) : "Unavailable"}
      </p>
    </div>
  );
}

/**
 * "Same picture, by market" — switched from the mock's authored `MARKETS` (invented customer
 * counts, currencies and bar percentages) to `GET /leakage/report`'s own per-market `gross`
 * (docs/leakage-map/build-plan.md mismatch #9: `GET /leakage`'s own `markets[]` rail is
 * per-condition, not a single blended per-market figure — computing one client-side would violate
 * [[feedback_no_frontend_business_math]]). Per-market `customers` has no field on this DTO, so
 * it's dropped rather than invented.
 *
 * ❌ Backend does NOT provide: a per-market share/percent for a progress bar. A first pass added
 * one anyway — each row's width as its own `gross.value` divided by the list's max — but that
 * compares raw magnitudes across different currencies with no FX rate to make the comparison
 * honest (₦9.4M vs. CAD 3.1k isn't "NG is bigger", it's two different units), which directly
 * contradicts this very panel's own "money is never summed across currencies" message. Removed
 * rather than computed client-side, per [[feedback_no_frontend_business_math]] — if this endpoint
 * ever adds a real share field, wire that instead of re-deriving one.
 *
 * **Confirmed live 2026-09-24**, first populated response this endpoint has produced — corrected
 * two guessed shapes: `gross`/`realized`/`expected`/`net` are `LeakageMeasuredValueDto`-wrapped,
 * not plain nullable numbers (see get-leakage-report.ts), and `countryCode` is genuinely `null` on
 * every non-primary market in this workspace, not just a documentation gap — see `marketRowLabel`
 * above for why this renders the currency instead of the shared `marketOptionLabel` fallback.
 */
export function MarketBreakdown({ markets }: { markets?: LeakageReportMarketDto[] }) {
  if (!markets || markets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-card border border-line bg-paper p-5">
        <h2 className="text-[14.5px] font-semibold text-ink">Same picture, by market</h2>
        <div className="mt-1">
          {markets.map((market) => (
            <MarketRow key={market.currency} market={market} />
          ))}
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper p-5">
        <h2 className="text-[14.5px] leading-snug font-semibold text-ink">
          There is no single total here, and that is deliberate
        </h2>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          Money is never summed across currencies or across conditions — a blended figure would
          hide which market actually carries the exposure.
        </p>
      </div>
    </div>
  );
}
