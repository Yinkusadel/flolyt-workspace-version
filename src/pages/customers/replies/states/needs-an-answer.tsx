import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { RepliesTabs } from "@/pages/customers/replies/tabs";
import { SendAnAnswerModal } from "@/pages/customers/replies/modals/send-an-answer-modal";
import { RP03_ROWS, RP03_STATS, RP_KPI_TONE, RP_TONE_CLASS, type NeedsAnswerRow } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function DraftReadyCell({ row, onSend }: { row: NeedsAnswerRow; onSend: () => void }) {
  if (row.rowAction === "send" && row.draftReady) {
    return (
      <button type="button" onClick={onSend}>
        <Chip tone="ultra" className={CHIP_INTERACTIVE_CLASS}>
          yes
        </Chip>
      </button>
    );
  }
  return <Chip tone={row.draftReady ? "ultra" : "neutral"}>{row.draftReady ? "yes" : "no"}</Chip>;
}

/** RP03 — the default populated "Needs an answer" state, and /replies' index tab. */
export function NeedsAnAnswerState() {
  const navigate = useNavigate();
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Replies</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">31 waiting · 18 drafted and unsent · the oldest has been waiting 164 days</p>
        </div>
        <Button type="button" onClick={() => navigate("/replies/4118207")}>
          Open the oldest
        </Button>
      </div>

      <RepliesTabs active="Needs an answer" />

      <KpiCards items={RP03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: RP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Waiting for a person</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>From</th>
                <th className={HEAD_CLASS}>What it is about</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Waiting</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Routes to</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Draft ready?</th>
                <th className={HEAD_CLASS}>In a cohort we are working on</th>
              </tr>
            </thead>
            <tbody>
              {RP03_ROWS.map((row) => (
                <tr key={row.from} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {row.id ? (
                      <Link to={`/replies/${row.id}`} className="text-ultra hover:underline">
                        {row.from}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{row.from}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.about}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", RP_TONE_CLASS[row.waitingTone])}>{row.waiting}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.routesTo}</td>
                  <td className="px-4 py-3 text-right">
                    <DraftReadyCell row={row} onSend={() => setSendOpen(true)} />
                  </td>
                  <td className={cn("px-4 py-3", RP_TONE_CLASS[row.cohortTone])}>{row.cohort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {RP03_ROWS.map((row) => (
            <div key={row.from} className="rounded-card border border-line bg-paper p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                {row.id ? (
                  <Link to={`/replies/${row.id}`} className="text-[12.5px] font-semibold text-ultra hover:underline">
                    {row.from}
                  </Link>
                ) : (
                  <span className="text-[12.5px] font-semibold text-ink">{row.from}</span>
                )}
                <span className={cn("font-mono text-[11.5px] font-semibold", RP_TONE_CLASS[row.waitingTone])}>{row.waiting}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.about}</p>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <DraftReadyCell row={row} onSend={() => setSendOpen(true)} />
                <span className="text-[10.5px] text-ink-4">{row.routesTo}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="amber" title="Two of these five are asking about things the workspace did to them">
        One wants to know why they received three messages in a fortnight, and one was held back from a campaign
        and is asking whether the company has forgotten them. Both are the direct result of decisions made on
        other screens in this product, and both route to Ifeoma, who made them. There is no separate queue for
        consequences.
      </Callout>

      <Callout tone="ultra" title="Eighteen replies have a draft and no sender">
        Support Signal writes a draft the moment a reply arrives, with the order history, the cohort and the
        relevant room attached. None of them has gone anywhere. The draft is not the bottleneck and never was — the
        bottleneck is that a person has to read it and press send, which is the design and also why the oldest one
        is 164 days old.
      </Callout>

      <SendAnAnswerModal open={sendOpen} onOpenChange={setSendOpen} />
    </div>
  );
}
