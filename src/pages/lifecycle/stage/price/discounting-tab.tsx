import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { PRICE_DISCOUNTING_KPIS, PRICE_DISCOUNT_GROUP_ROWS, PRICE_DISCOUNT_MEMORY_CARDS, type DiscountGroupRow, type PriceMemoryCard } from "@/pages/lifecycle/stage/price/data";

const DISCOUNTED_TONE_CLASS: Record<DiscountGroupRow["discountedTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const FULL_PRICE_TONE_CLASS: Record<DiscountGroupRow["fullPriceTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const AT_STAKE_TONE_CLASS: Record<DiscountGroupRow["atStakeTone"], string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };

const CARD_EYEBROW_CLASS: Record<PriceMemoryCard["tone"], string> = { ultra: "text-ultra", amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<DiscountGroupRow>[] = [
  { key: "group", header: "Group", render: (row) => <span className="font-semibold text-ink-2">{row.group}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "discountedOrders", header: "Discounted orders", align: "right", render: (row) => <span className={DISCOUNTED_TONE_CLASS[row.discountedTone]}>{row.discountedOrders}</span> },
  { key: "fullPriceOrders", header: "Full-price orders", align: "right", render: (row) => <span className={FULL_PRICE_TONE_CLASS[row.fullPriceTone]}>{row.fullPriceOrders}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={`font-mono ${AT_STAKE_TONE_CLASS[row.atStakeTone]}`}>{row.atStake}</span> },
];

/** PR06 — Price's Discounting tab. */
const PriceDiscountingTab = () => {
  return (
    <div className="space-y-8">
      <KpiCards items={PRICE_DISCOUNTING_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who takes discounts, and what they do next</p>
        <DataTable columns={COLUMNS} rows={PRICE_DISCOUNT_GROUP_ROWS} />
      </section>

      <Callout tone="amber" title="The 41,000 in the last row are the clearest waste and the hardest to prove">
        They are customers whose behaviour before the discount matched the full-price cohort exactly. Flolyt calls
        them likely-unnecessary, not unnecessary — without a holdout on that campaign the counterfactual does not
        exist, and the row says so.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What business memory already knows about this</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRICE_DISCOUNT_MEMORY_CARDS.map((card) => (
            <div key={card.id} className="rounded-card border border-line bg-paper">
              <div className="flex h-full flex-col gap-2.5 p-4">
                <p className={`font-mono text-[9px] font-medium tracking-[0.85px] uppercase ${CARD_EYEBROW_CLASS[card.tone]}`}>{card.eyebrow}</p>
                <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${CARD_EYEBROW_CLASS[card.tone]}`}>
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PriceDiscountingTab;
