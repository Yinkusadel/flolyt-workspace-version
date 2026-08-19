import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  EXPAND_MARKET_CLOSING,
  EXPAND_MARKET_FINAL_CLOSING,
  EXPAND_MARKET_GHANA_ROWS,
  EXPAND_MARKET_ROWS,
  type ExpandMarketRow,
} from "@/pages/everyday/lifecycle/stage/expand/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const AT_STAKE_TONE_CLASS: Record<ExpandMarketRow["atStakeTone"], string> = { amber: "text-amber", neutral: "text-ink-4" };
const TREND_TONE_CLASS: Record<ExpandMarketRow["trend"], string> = { flat: "text-ink-4", improving: "text-teal", worsening: "text-rose" };

const COLUMNS: Column<ExpandMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "eligible", header: "Eligible", align: "right", render: (row) => <span className="font-mono text-ink">{row.eligible}</span> },
  { key: "expanded", header: "Expanded", align: "right", render: (row) => <span className="font-mono text-ink">{row.expanded}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "arpuMultiple", header: "ARPU multiple", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.arpuMultipleTone]}>{row.arpuMultiple}</span> },
  { key: "businessAccounts", header: "Business accounts", align: "right", render: (row) => <span className="font-mono text-ink">{row.businessAccounts}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={AT_STAKE_TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_TONE_CLASS[row.trend]}>{row.trend}</span> },
];

/**
 * EX08 — Expand's Markets tab (stage-specific layout, not the shared
 * MarketsTab template — EX08's columns are expansion rate/ARPU multiple/
 * business accounts, not Acquire's spend/CAC, confirmed by reading EX08
 * directly).
 */
const ExpandMarketsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={EXPAND_MARKET_ROWS} />

      <Callout tone="rose" title={EXPAND_MARKET_CLOSING.title}>
        {EXPAND_MARKET_CLOSING.body}
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>The sixth consecutive stage where Ghana is worst</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {EXPAND_MARKET_GHANA_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className="font-mono text-[11px] text-rose">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="rose" title={EXPAND_MARKET_FINAL_CLOSING.title}>
        {EXPAND_MARKET_FINAL_CLOSING.body}
      </Callout>
    </div>
  );
};

export default ExpandMarketsTab;
