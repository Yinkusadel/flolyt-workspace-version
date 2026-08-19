import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  RENEW_MARKET_CLOSING,
  RENEW_MARKET_GHANA_ROWS,
  RENEW_MARKET_ROWS,
  type RenewMarketRow,
} from "@/pages/everyday/lifecycle/stage/renew/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const AT_STAKE_TONE_CLASS: Record<RenewMarketRow["atStakeTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const TREND_CLASS: Record<RenewMarketRow["trend"], string> = { worsening: "text-rose", flat: "text-ink-4", improving: "text-teal" };

const COLUMNS: Column<RenewMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "renewing", header: "Renewing / yr", align: "right", render: (row) => <span className="font-mono text-ink">{row.renewing}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "cardFailure", header: "Card failure", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.cardFailureTone]}>{row.cardFailure}</span> },
  { key: "retryWindow", header: "Retry window", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.retryWindowTone]}>{row.retryWindow}</span> },
  { key: "paused", header: "Paused", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.pausedTone]}>{row.paused}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={AT_STAKE_TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_CLASS[row.trend]}>{row.trend}</span> },
];

/**
 * RN07 — Renew's Markets tab (stage-specific layout, not the shared
 * MarketsTab template — RN07's columns are rate/card-failure/retry-window/
 * paused, not Acquire's spend/CAC, confirmed by reading RN07 directly).
 */
const RenewMarketsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={RENEW_MARKET_ROWS} />

      <Callout tone="rose" title={RENEW_MARKET_CLOSING.title}>
        {RENEW_MARKET_CLOSING.body}
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Eighth consecutive stage</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {RENEW_MARKET_GHANA_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className="font-mono text-[11px] text-rose">{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RenewMarketsTab;
