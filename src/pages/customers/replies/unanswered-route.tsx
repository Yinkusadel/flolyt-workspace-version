import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RepliesTabs } from "@/pages/customers/replies/tabs";
import { CloseWithoutAnsweringModal } from "@/pages/customers/replies/modals/close-without-answering-modal";
import { RP06_ROWS, RP06_STATS, RP_KPI_TONE, RP_TONE_CLASS, type UnansweredRow } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function FixableCell({ row, onClose }: { row: UnansweredRow; onClose: () => void }) {
  if (row.rowAction === "close") {
    return (
      <button
        type="button"
        onClick={onClose}
        className="font-mono text-[10.5px] text-rose underline decoration-dotted underline-offset-2 hover:text-rose"
      >
        {row.fixable}
      </button>
    );
  }
  return <Chip tone={row.fixableTone === "ok" ? "teal" : row.fixableTone === "warn" ? "amber" : row.fixableTone === "risk" ? "rose" : "neutral"}>{row.fixable}</Chip>;
}

/** RP06 — /replies/unanswered. */
const RepliesUnansweredRoute = () => {
  const [closeOpen, setCloseOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Unanswered</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">412 never answered · 168 of them routed to stages with no owner</p>
        </div>
        <Button type="button" onClick={() => toast.success("Assigning an owner to Adopt and Advocate")}>
          Assign an owner
        </Button>
      </div>

      <RepliesTabs active="Unanswered" />

      <KpiCards items={RP06_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: RP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Why 412 people never heard back</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Reason</th>
                <th className={`${HEAD_CLASS} text-right`}>Messages</th>
                <th className={HEAD_CLASS}>What it means</th>
                <th className={`${HEAD_CLASS} text-right`}>Fixable</th>
                <th className={`${HEAD_CLASS} text-right`}>Who by</th>
              </tr>
            </thead>
            <tbody>
              {RP06_ROWS.map((row) => (
                <tr key={row.reason} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.reason}</td>
                  <td className={`px-4 py-3 text-right font-mono ${RP_TONE_CLASS[row.messagesTone]}`}>{row.messages}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whatItMeans}</td>
                  <td className="px-4 py-3 text-right">
                    <FixableCell row={row} onClose={() => setCloseOpen(true)} />
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.whoBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Twenty-one people were not answered because nobody was sure it was permitted">
        They were in a holdout, they wrote in, and the person looking at the queue could not tell whether replying
        would ruin an experiment. It would not — a reply is not a treatment, and the answer is now written on the
        first screen of this section. Five months of silence came from an unanswered question about the product
        rather than from anybody's decision.
      </Callout>

      <Callout tone="rose" title="A hundred and sixty-eight of these have no owner and never will until somebody is named">
        They are routed correctly to Adopt and Advocate, which have had nobody in the field for 214 days. Nothing
        escalates, nothing reassigns and nothing lapses. The count rises, which is the same mechanism as the nine
        breached thresholds and the nineteen findings, arriving here as 168 people who wrote to a company that did
        not write back.
      </Callout>

      <CloseWithoutAnsweringModal open={closeOpen} onOpenChange={setCloseOpen} />
    </div>
  );
};

export default RepliesUnansweredRoute;
