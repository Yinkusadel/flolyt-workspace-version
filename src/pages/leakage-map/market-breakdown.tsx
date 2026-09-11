import { cn } from "@/lib/utils";
import { MARKETS, NO_SINGLE_TOTAL, type Market } from "@/pages/leakage-map/data";

const BAR_TONE_CLASS: Record<Market["tone"], string> = {
  rose: "bg-rose",
  amber: "bg-amber",
  teal: "bg-teal",
};

function MarketRow({ market }: { market: Market }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className="text-[13px] font-semibold text-ink">
          {market.name} <span className="font-normal text-ink-4">· {market.customers}</span>
        </p>
        <p className="text-[13px] font-semibold text-ink">{market.amount}</p>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
        <div
          className={cn("h-full rounded-full", BAR_TONE_CLASS[market.tone])}
          style={{ width: `${market.barPercent}%` }}
        />
      </div>
    </div>
  );
}

export function MarketBreakdown() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-card border border-line bg-paper p-5">
        <h2 className="text-[14.5px] font-semibold text-ink">Same picture, by market</h2>
        <div className="mt-4 space-y-4">
          {MARKETS.map((market) => (
            <MarketRow key={market.name} market={market} />
          ))}
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper p-5">
        <h2 className="text-[14.5px] leading-snug font-semibold text-ink">
          {NO_SINGLE_TOTAL.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">{NO_SINGLE_TOTAL.body[0]}</p>
        <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-3">
          {NO_SINGLE_TOTAL.body[1]}
        </p>
      </div>
    </div>
  );
}
