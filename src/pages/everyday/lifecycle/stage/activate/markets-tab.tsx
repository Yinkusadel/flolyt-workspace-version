import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import {
  ACTIVATE_MARKET_GHANA_ROWS,
  ACTIVATE_MARKET_KENYA_INSIGHT,
  ACTIVATE_MARKET_ROWS,
  type ActivateMarketRow,
} from "@/pages/everyday/lifecycle/stage/activate/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const GUEST_SHARE_TONE_CLASS: Record<"teal" | "amber" | "rose", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const STAKE_TONE_CLASS: Record<"teal" | "amber" | "rose" | "neutral", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const TREND_CLASS: Record<ActivateMarketRow["trend"], string> = { worsening: "text-rose", improving: "text-teal", flat: "text-ink-4" };
const GHANA_ROW_TONE_CLASS: Record<"amber" | "rose", string> = { amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<ActivateMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "enter", header: "Enter", align: "right", render: (row) => <span className="font-mono text-ink">{row.enter}</span> },
  { key: "activate", header: "Activate", align: "right", render: (row) => <span className="font-mono text-ink">{row.activate}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "medianDays", header: "Median days", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.medianTone]}>{row.medianDays}</span> },
  { key: "guestShare", header: "Guest share", align: "right", render: (row) => <span className={GUEST_SHARE_TONE_CLASS[row.guestShareTone]}>{row.guestShare}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={STAKE_TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_CLASS[row.trend]}>{row.trend}</span> },
];

/** AC07 — Activate's Markets tab (stage-specific layout, not the shared MarketsTab template). */
const ActivateMarketsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={ACTIVATE_MARKET_ROWS} />

      <Callout tone="teal" title={ACTIVATE_MARKET_KENYA_INSIGHT.title}>
        {ACTIVATE_MARKET_KENYA_INSIGHT.body}
      </Callout>

      <section className="space-y-1">
        <p className="pb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Ghana is worse than Nigeria on every measure in this stage
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {ACTIVATE_MARKET_GHANA_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${GHANA_ROW_TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ActivateMarketsTab;
