import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { RequestInstrumentationModal } from "@/pages/lifecycle/stage/modals/request-instrumentation-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  ADOPT_BLIND_SPOT_COST_CARDS,
  ADOPT_BLIND_SPOT_ROWS,
  ADOPT_REQUEST_INSTRUMENTATION_PRESET,
  type BlindSpotRow,
} from "@/pages/lifecycle/stage/adopt/data";

const WHY_INVISIBLE_TONE_CLASS: Record<BlindSpotRow["whyInvisibleTone"], string> = { rose: "text-rose", amber: "text-amber" };
const REQUESTED_TONE_CLASS: Record<BlindSpotRow["requestedTone"], string> = { neutral: "text-ink-4", amber: "text-amber" };
const CARD_EYEBROW_CLASS: Record<"teal" | "amber" | "neutral" | "rose", string> = { teal: "text-teal", amber: "text-amber", neutral: "text-ink-4", rose: "text-rose" };

const COLUMNS: Column<BlindSpotRow>[] = [
  { key: "what", header: "What", render: (row) => <span className="font-semibold text-ink-2">{row.what}</span> },
  { key: "shipped", header: "Shipped", render: (row) => <span className="text-ink-2">{row.shipped}</span> },
  { key: "whyInvisible", header: "Why it is invisible", align: "right", render: (row) => <span className={WHY_INVISIBLE_TONE_CLASS[row.whyInvisibleTone]}>{row.whyInvisible}</span> },
  {
    key: "whoCouldFix",
    header: "Who could fix it",
    align: "right",
    render: (row) =>
      row.whoCouldFix ? (
        <span className="flex items-center justify-end gap-1.5 whitespace-nowrap text-ink-2">
          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.whoCouldFix.color }} aria-hidden />
          {row.whoCouldFix.name}
        </span>
      ) : row.noOwner ? (
        <Chip tone="amber">No owner</Chip>
      ) : null,
  },
  { key: "requested", header: "Requested", align: "right", render: (row) => <span className={REQUESTED_TONE_CLASS[row.requestedTone]}>{row.requested}</span> },
  { key: "state", header: "State", align: "right", render: (row) => <Chip tone={row.stateTone}>{row.state}</Chip> },
];

/** AD06 — Adopt's "Not instrumented" tab (route path blind-spots per the SVG footer). */
const AdoptBlindSpotsTab = () => {
  const { headerActionsEl } = useStageContext();
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setRequestOpen(true)}>
            Request instrumentation
          </Button>,
          headerActionsEl
        )}

      <Callout tone="amber" title="What Flolyt cannot see, listed rather than left out">
        Every row below is a real part of the product with no event behind it. None of them appear as zero anywhere
        in Flolyt — a feature nobody can measure is not a feature nobody uses, and the difference matters more here
        than in any other stage.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Blind spots in this stage · 5</p>
        <DataTable columns={COLUMNS} rows={ADOPT_BLIND_SPOT_ROWS} />
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What each blind spot costs, as far as anyone can tell</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ADOPT_BLIND_SPOT_COST_CARDS.map((card) => (
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

      <RequestInstrumentationModal preset={ADOPT_REQUEST_INSTRUMENTATION_PRESET} open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
};

export default AdoptBlindSpotsTab;
