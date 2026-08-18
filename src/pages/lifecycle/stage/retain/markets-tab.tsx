import { Callout } from "@/pages/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  RETAIN_MARKET_CLOSING,
  RETAIN_MARKET_PREVENT_ROWS,
  RETAIN_MARKET_ROWS,
  type RetainMarketRow,
} from "@/pages/lifecycle/stage/retain/data";

const REPEAT_RATE_TONE_CLASS: Record<RetainMarketRow["repeatRateTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const MEDIAN_TONE_CLASS: Record<RetainMarketRow["medianDaysTone"], string> = { teal: "text-teal", rose: "text-rose" };
const AT_STAKE_TONE_CLASS: Record<RetainMarketRow["atStakeTone"], string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const FEE_SHIPPED_TONE_CLASS: Record<RetainMarketRow["feeShippedTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const TREND_TONE_CLASS: Record<RetainMarketRow["trendTone"], string> = { rose: "text-rose", amber: "text-amber", teal: "text-teal", neutral: "text-ink-4" };

const COLUMNS: Column<RetainMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "repeatRate", header: "Repeat rate", align: "right", render: (row) => <span className={REPEAT_RATE_TONE_CLASS[row.repeatRateTone]}>{row.repeatRate}</span> },
  { key: "medianDays", header: "Median days", align: "right", render: (row) => <span className={MEDIAN_TONE_CLASS[row.medianDaysTone]}>{row.medianDays}</span> },
  { key: "reactivableNow", header: "Reactivable now", align: "right", render: (row) => <span className="font-mono text-ink">{row.reactivableNow}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={AT_STAKE_TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "feeShipped", header: "Fee shipped", align: "right", render: (row) => <span className={FEE_SHIPPED_TONE_CLASS[row.feeShippedTone]}>{row.feeShipped}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_TONE_CLASS[row.trendTone]}>{row.trend}</span> },
];

/**
 * RT08 — Retain's Markets tab (stage-specific layout, not the shared
 * MarketsTab template — RT08's columns are repeat rate/median days/fee
 * shipped, not Acquire's spend/CAC, confirmed by reading RT08 directly).
 */
const RetainMarketsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={RETAIN_MARKET_ROWS} />

      <Callout tone="rose" title={RETAIN_MARKET_CLOSING.title}>
        {RETAIN_MARKET_CLOSING.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>What preventing it would be worth</p>
        <div className="space-y-5">
          {RETAIN_MARKET_PREVENT_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default RetainMarketsTab;
