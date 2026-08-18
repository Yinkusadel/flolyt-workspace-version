import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { ConnectACogsSourceModal } from "@/pages/lifecycle/stage/modals/connect-a-cogs-source-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import { PRICE_CONNECT_COGS_PRESET, PRICE_MARGIN_BLOCKED_ROWS, PRICE_MARGIN_CARDS, type MarginBlockedRow } from "@/pages/lifecycle/stage/price/data";

const CURRENTLY_TONE_CLASS: Record<MarginBlockedRow["currentlyTone"], string> = { amber: "text-amber", neutral: "text-ink-4" };
const VALUE_TONE_CLASS: Record<MarginBlockedRow["valueTone"], string> = { amber: "text-amber", rose: "text-rose" };
const CARD_ACCENT_CLASS: Record<"teal" | "amber" | "neutral" | "rose", string> = { teal: "bg-teal", amber: "bg-amber", neutral: "bg-ink-4", rose: "bg-rose" };
const CARD_EYEBROW_CLASS: Record<"teal" | "amber" | "neutral" | "rose", string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4", rose: "text-rose" };

const COLUMNS: Column<MarginBlockedRow>[] = [
  { key: "what", header: "What", render: (row) => <span className="font-semibold text-ink-2">{row.what}</span> },
  { key: "where", header: "Where", render: (row) => <span className="text-ink-2">{row.where}</span> },
  { key: "currentlyShows", header: "Currently shows", align: "right", render: (row) => <span className={`font-mono ${CURRENTLY_TONE_CLASS[row.currentlyTone]}`}>{row.currentlyShows}</span> },
  { key: "wouldShow", header: "Would show", align: "right", render: (row) => <span className="text-teal">{row.wouldShow}</span> },
  { key: "valueOfUnblocking", header: "Value of unblocking", align: "right", render: (row) => <span className={VALUE_TONE_CLASS[row.valueTone]}>{row.valueOfUnblocking}</span> },
];

/** PR05 — Price's Margin tab, entirely blocked on a cost-of-goods source. */
const PriceMarginTab = () => {
  const [cogsOpen, setCogsOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setCogsOpen(true)}>
          Connect a COGS source
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-panel border-2 border-amber-border bg-amber-bg pl-5">
        <span className="absolute inset-y-0 left-0 w-1 bg-amber" aria-hidden />
        <div className="space-y-3 p-5 pl-2">
          <h2 className="text-[15px] font-semibold text-ink">Contribution margin is unavailable, everywhere in Flolyt</h2>
          <p className="text-[11px] leading-relaxed text-ink-2">
            No connected source provides cost of goods. Flolyt could estimate it from a category benchmark and will not —
            a margin built on a guess ends up in a board deck and stays there for two years.
          </p>
          <p className="font-mono text-[10.5px] font-semibold text-amber">
            One CSV of cost per SKU per month would unblock every figure on this page.
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is blocked by this, across the whole product</p>
        <DataTable columns={COLUMNS} rows={PRICE_MARGIN_BLOCKED_ROWS} />
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What Flolyt will show instead, and what it refuses to</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRICE_MARGIN_CARDS.map((card) => (
            <div key={card.id} className="relative overflow-hidden rounded-card border border-line bg-paper pl-4">
              <span className={`absolute inset-y-0 left-0 w-[3px] ${CARD_ACCENT_CLASS[card.tone]}`} aria-hidden />
              <div className="flex h-full flex-col gap-2.5 p-4 pl-1">
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

      <ConnectACogsSourceModal preset={PRICE_CONNECT_COGS_PRESET} open={cogsOpen} onOpenChange={setCogsOpen} />
    </div>
  );
};

export default PriceMarginTab;
