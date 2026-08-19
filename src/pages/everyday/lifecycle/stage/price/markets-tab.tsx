import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  PRICE_MARKET_CLOSING,
  PRICE_MARKET_FX_DRIFT_ROWS,
  PRICE_MARKET_INSIGHT,
  PRICE_MARKET_ROWS,
  type PriceMarketRow,
} from "@/pages/everyday/lifecycle/stage/price/data";

const IN_NAIRA_TONE_CLASS: Record<PriceMarketRow["inNairaTone"], string> = { ink: "text-ink", amber: "text-amber", rose: "text-rose" };
const VS_NIGERIA_TONE_CLASS: Record<PriceMarketRow["vsNigeriaTone"], string> = { ink: "text-ink-4", teal: "text-teal", rose: "text-rose" };
const LAST_REPRICED_TONE_CLASS: Record<PriceMarketRow["lastRepricedTone"], string> = { teal: "text-teal", rose: "text-rose" };

const COLUMNS: Column<PriceMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "basket", header: "Basket", align: "right", render: (row) => <span className="font-mono text-ink">{row.basket}</span> },
  { key: "inNairaToday", header: "In naira today", align: "right", render: (row) => <span className={`font-mono ${IN_NAIRA_TONE_CLASS[row.inNairaTone]}`}>{row.inNairaToday}</span> },
  { key: "vsNigeria", header: "vs Nigeria", align: "right", render: (row) => <span className={VS_NIGERIA_TONE_CLASS[row.vsNigeriaTone]}>{row.vsNigeria}</span> },
  { key: "lastRepriced", header: "Last repriced", align: "right", render: (row) => <span className={LAST_REPRICED_TONE_CLASS[row.lastRepricedTone]}>{row.lastRepriced}</span> },
  { key: "margin", header: "Margin", align: "right", render: () => <span className="font-mono text-ink-4">Unavailable</span> },
];

/**
 * PR08 — Price's Markets tab (stage-specific layout, not the shared
 * MarketsTab template — PR08's columns are FX/repricing, not Acquire's
 * spend/CAC, confirmed by reading PR08 directly).
 */
const PriceMarketsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={PRICE_MARKET_ROWS} />

      <Callout tone="amber" title={PRICE_MARKET_INSIGHT.title}>
        {PRICE_MARKET_INSIGHT.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>What 22 months of FX drift did in Ghana</p>
        <div className="space-y-5">
          {PRICE_MARKET_FX_DRIFT_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="rose" title={PRICE_MARKET_CLOSING.title}>
        {PRICE_MARKET_CLOSING.body}
      </Callout>
    </div>
  );
};

export default PriceMarketsTab;
