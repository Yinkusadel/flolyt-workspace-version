import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import ActivateMarketsTab from "@/pages/lifecycle/stage/activate/markets-tab";
import PriceMarketsTab from "@/pages/lifecycle/stage/price/markets-tab";
import AdoptMarketsTab from "@/pages/lifecycle/stage/adopt/markets-tab";
import RetainMarketsTab from "@/pages/lifecycle/stage/retain/markets-tab";
import ExpandMarketsTab from "@/pages/lifecycle/stage/expand/markets-tab";
import SupportMarketsTab from "@/pages/lifecycle/stage/support/markets-tab";
import RenewMarketsTab from "@/pages/lifecycle/stage/renew/markets-tab";
import { ACQUIRE_MARKET_ROWS, ACQUIRE_MARKET_SPOTLIGHTS, type MarketRow } from "@/pages/lifecycle/stage/acquire/data";

type MarketsData = {
  eyebrow: string;
  rows: MarketRow[];
  insightTitle: string;
  insightBody: string;
  spotlightEyebrow: string;
  spotlights: { id: string; eyebrow: string; tone: "teal" | "rose"; title: string; body: string; footnote: string }[];
};

const MARKETS_DATA: Record<string, MarketsData> = {
  acquire: {
    eyebrow: "Four markets, four currencies · no combined figure on this screen",
    rows: ACQUIRE_MARKET_ROWS,
    insightTitle: "Four currencies, four rows, and no total",
    insightBody:
      "There is no combined CAC on this screen because there is no such thing as a combined CAC. Where a cross-market figure is genuinely needed — an exec digest, a board export — the rate and the date it was taken are printed beside it.",
    spotlightEyebrow: "The same question in four places",
    spotlights: ACQUIRE_MARKET_SPOTLIGHTS,
  },
};

const TREND_CLASS: Record<MarketRow["trend"], string> = {
  worsening: "text-rose",
  flat: "text-ink-4",
  improving: "text-teal",
};

const CAC_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const STAKE_TONE_CLASS: Record<MarketRow["atStakeTone"], string> = { rose: "text-rose", neutral: "text-ink-4" };

const SPOTLIGHT_ACCENT_CLASS: Record<"teal" | "rose", string> = { teal: "bg-teal", rose: "bg-rose" };

const COLUMNS: Column<MarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "spend", header: "Spend", align: "right", render: (row) => <span className="font-mono text-ink">{row.spend}</span> },
  { key: "cac", header: "CAC", align: "right", render: (row) => <span className={CAC_TONE_CLASS[row.cacTone]}>{row.cac}</span> },
  {
    key: "reach2nd",
    header: "Reach 2nd order",
    align: "right",
    render: (row) => <span className={CAC_TONE_CLASS[row.reach2ndTone]}>{row.reach2nd}</span>,
  },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={STAKE_TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "trend", header: "Trend", align: "right", render: (row) => <span className={TREND_CLASS[row.trend]}>{row.trend}</span> },
];

/** The shared Markets tab template (e.g. A08) — every stage's per-market breakout, no combined total by design. */
export function MarketsTab() {
  const { stage } = useStageContext();

  // Activate's Markets screen (AC07) uses a different column set (activation
  // rate/guest share, not spend/CAC) — routed to its own component rather
  // than forcing this template's Acquire-shaped columns onto it.
  if (stage.slug === "activate") return <ActivateMarketsTab />;
  // Price's PR08 uses FX-drift/repricing columns, not Acquire's spend/CAC.
  if (stage.slug === "price") return <PriceMarketsTab />;
  // Adopt's AD08 uses eligible/2+features/top-second-feature columns, not spend/CAC.
  if (stage.slug === "adopt") return <AdoptMarketsTab />;
  // Retain's RT08 uses repeat-rate/median-days/reactivable-now/fee-shipped columns, not spend/CAC.
  if (stage.slug === "retain") return <RetainMarketsTab />;
  // Expand's EX08 uses expansion-rate/ARPU-multiple/business-accounts columns, not spend/CAC.
  if (stage.slug === "expand") return <ExpandMarketsTab />;
  // Support's SU07 uses contact-rate/resolution/silent-failures/delivery-feed columns, not spend/CAC.
  if (stage.slug === "support") return <SupportMarketsTab />;
  // Renew's RN07 uses rate/card-failure/retry-window/paused columns, not spend/CAC.
  if (stage.slug === "renew") return <RenewMarketsTab />;

  const data = MARKETS_DATA[stage.slug];
  if (!data) return null;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.eyebrow}</p>
        <DataTable columns={COLUMNS} rows={data.rows} />
      </section>

      <Callout tone="amber" title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          {data.spotlightEyebrow}
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.spotlights.map((spot) => (
            <div key={spot.id} className="relative overflow-hidden rounded-card border border-line bg-paper pl-4">
              <span className={`absolute inset-y-0 left-0 w-[3px] ${SPOTLIGHT_ACCENT_CLASS[spot.tone]}`} aria-hidden />
              <div className="space-y-2.5 p-4 pl-1">
                <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">{spot.eyebrow}</p>
                <h3 className="text-[13px] font-semibold text-ink">{spot.title}</h3>
                <p className="text-[10.5px] leading-relaxed text-ink-3">{spot.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${CAC_TONE_CLASS[spot.tone]}`}>
                  {spot.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
