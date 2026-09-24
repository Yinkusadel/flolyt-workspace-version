import { marketOptionLabel } from "@/pages/leakage-map/filters";
import { formatCompactMoney } from "@/lib/format-measured-value";
import type { LeakageReportMarketDto } from "@/services/api/leakage/get-leakage-report";

function MarketRow({ market, maxGross }: { market: LeakageReportMarketDto; maxGross: number }) {
  const barPercent = maxGross > 0 && market.gross !== null ? Math.round((market.gross / maxGross) * 100) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className="text-[13px] font-semibold text-ink">{marketOptionLabel(market)}</p>
        <p className="text-[13px] font-semibold text-ink">
          {market.gross !== null ? formatCompactMoney(market.gross, market.currency) : "Unavailable"}
        </p>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
        <div className="h-full rounded-full bg-rose" style={{ width: `${barPercent}%` }} />
      </div>
    </div>
  );
}

/**
 * "Same picture, by market" — switched from the mock's authored `MARKETS` (invented customer
 * counts, currencies and bar percentages) to `GET /leakage/report`'s own per-market `gross`
 * (docs/leakage-map/build-plan.md mismatch #9: `GET /leakage`'s own `markets[]` rail is
 * per-condition, not a single blended per-market figure — computing one client-side would violate
 * [[feedback_no_frontend_business_math]]). The bar's width is the one derived number here, and
 * it's purely visual — a proportion against this list's own max `gross`, never shown as data.
 * Reuses `marketOptionLabel` from filters.ts for the row label, matching the page's own market
 * switcher rather than introducing a second "how do we name a market" convention. Per-market
 * `customers` has no field on this DTO, so it's dropped rather than invented.
 *
 * **The report's per-market shape is still unconfirmed live** — every real pull so far returned
 * `markets: []` (no completed refresh yet), so `gross`/`expected`/`net` on a populated entry are
 * typed from the endpoint's prose only. See docs/endpoints/leakage.md's `GET /leakage/report`
 * section. Renders nothing rather than a skeleton or invented rows until a populated response is
 * seen.
 */
export function MarketBreakdown({ markets }: { markets?: LeakageReportMarketDto[] }) {
  if (!markets || markets.length === 0) return null;

  const maxGross = Math.max(...markets.map((m) => m.gross ?? 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-card border border-line bg-paper p-5">
        <h2 className="text-[14.5px] font-semibold text-ink">Same picture, by market</h2>
        <div className="mt-4 space-y-4">
          {markets.map((market) => (
            <MarketRow key={market.currency} market={market} maxGross={maxGross} />
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
