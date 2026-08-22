import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentCell } from "@/pages/agents/ai-teammates/agent-cell";
import { TeammatesTabs } from "@/pages/agents/ai-teammates/tabs";
import { AddToRoomModal } from "@/pages/agents/ai-teammates/modals/add-to-room-modal";
import { TM04_ROWS, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM04 — /ai-teammates/coverage. */
const CoverageRoute = () => {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Coverage</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Nine stages of ten watched · two route to empty fields · one has nothing to read</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            Add an agent to a room
          </Button>
          <Button type="button" size="sm" onClick={() => toast.info("Assigning stage owners lives in Lifecycle settings")}>
            Assign an owner
          </Button>
        </div>
      </div>

      <TeammatesTabs active="Coverage" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Which stages have an agent, and what happens to what it finds</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Human owner</th>
                <th className={`${HEAD_CLASS} text-right`}>Findings</th>
                <th className={`${HEAD_CLASS} text-right`}>Rooms</th>
                <th className={HEAD_CLASS}>Where findings land</th>
              </tr>
            </thead>
            <tbody>
              {TM04_ROWS.map((row) => (
                <tr key={row.stage} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">
                    {row.stage === "Advocate" ? (
                      <Link to="/ai-teammates/advocate" className="hover:underline">
                        {row.stage}
                      </Link>
                    ) : (
                      row.stage
                    )}
                  </td>
                  <td className="px-4 py-3">{row.agent ? <AgentCell agent={row.agent} /> : <span className="text-rose">nobody</span>}</td>
                  <td className={`px-4 py-3 ${TM_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.findingsTone]}`}>{row.findings}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.roomsTone]}`}>{row.rooms}</td>
                  <td className={`px-4 py-3 ${TM_TONE_CLASS[row.whereTone]}`}>{row.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Advocate has no agent because there is nothing for one to read">
        Referral attribution has never been instrumented, so an agent assigned to Advocate would read an empty
        referral table and produce nothing forever. The row says nobody rather than showing a twelfth card with a
        zero next to it, because an agent that cannot see anything looks identical to one that has found nothing
        wrong.
      </Callout>

      <Callout tone="amber" title="Adding more agents would not help either of the two stages with a problem">
        Adopt and Churn are watched correctly by two of the best-performing agents in the workspace. Thirty-six
        findings, nine breached thresholds, zero rooms. The constraint is a person, and every screen in this
        product that ranks agent capability would suggest the opposite.
      </Callout>

      <AddToRoomModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};

export default CoverageRoute;
