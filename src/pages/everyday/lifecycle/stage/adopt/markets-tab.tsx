import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  ADOPT_MARKET_CLOSING,
  ADOPT_MARKET_GHANA_ROWS,
  ADOPT_MARKET_INSIGHT,
  ADOPT_MARKET_ROWS,
  type AdoptMarketRow,
} from "@/pages/everyday/lifecycle/stage/adopt/data";

const TWO_PLUS_TONE_CLASS: Record<AdoptMarketRow["twoPlusTone"], string> = { teal: "text-teal", rose: "text-rose" };
const AVG_FEATURES_TONE_CLASS: Record<AdoptMarketRow["avgFeaturesTone"], string> = { teal: "text-teal", rose: "text-rose" };
const AT_STAKE_TONE_CLASS: Record<AdoptMarketRow["atStakeTone"], string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const TREND_CLASS: Record<AdoptMarketRow["trend"], string> = { worsening: "text-rose", flat: "text-ink-4", improving: "text-teal" };
const GHANA_ROW_TONE_CLASS: Record<"amber" | "rose", string> = { amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<AdoptMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "eligible", header: "Eligible", align: "right", render: (row) => <span className="font-mono text-ink">{row.eligible}</span> },
  { key: "twoPlusFeatures", header: "2+ features", align: "right", render: (row) => <span className={TWO_PLUS_TONE_CLASS[row.twoPlusTone]}>{row.twoPlusFeatures}</span> },
  { key: "avgFeatures", header: "Avg features", align: "right", render: (row) => <span className={AVG_FEATURES_TONE_CLASS[row.avgFeaturesTone]}>{row.avgFeatures}</span> },
  { key: "topSecondFeature", header: "Top second feature", align: "right", render: (row) => <span className="text-ink-2">{row.topSecondFeature}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={`font-mono ${AT_STAKE_TONE_CLASS[row.atStakeTone]}`}>{row.atStake}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_CLASS[row.trend]}>{row.trend}</span> },
];

/**
 * AD08 — Adopt's Markets tab (stage-specific layout, not the shared
 * MarketsTab template — AD08's columns are eligible/2+features/top second
 * feature, not Acquire's spend/CAC, confirmed by reading AD08 directly).
 */
const AdoptMarketsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={ADOPT_MARKET_ROWS} />

      <Callout tone="teal" title={ADOPT_MARKET_INSIGHT.title}>
        {ADOPT_MARKET_INSIGHT.body}
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Ghana, again</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {ADOPT_MARKET_GHANA_ROWS.map((row, i) => (
            <div key={`${row.label}-${i}`} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${GHANA_ROW_TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="rose" title={ADOPT_MARKET_CLOSING.title}>
        {ADOPT_MARKET_CLOSING.body}
      </Callout>
    </div>
  );
};

export default AdoptMarketsTab;
