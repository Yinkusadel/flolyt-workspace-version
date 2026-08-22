import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AgentDetailTabs } from "@/pages/agents/agent-detail/tabs";
import { AgentDetailKvList } from "@/pages/agents/agent-detail/kv-list";
import { EditThresholdModal } from "@/pages/agents/agent-detail/modals/edit-threshold-modal";
import { AN03_KV, AN03_ROWS, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AN03 — /agent-detail/conditions, "What it watches". */
const ConditionsRoute = () => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <AgentHeader subtitle="Five conditions · four route to Ifeoma and one routes nowhere" />
        </div>
        <div className="flex shrink-0 justify-end">
          <Button type="button" variant="outline" size="sm" onClick={() => toast.info("Condition drafting opened")}>
            Add a condition
          </Button>
        </div>
      </div>

      <AgentDetailTabs active="What it watches" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[920px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Condition</th>
              <th className={`${HEAD_CLASS} text-right`}>Threshold</th>
              <th className={`${HEAD_CLASS} text-right`}>Currently</th>
              <th className={`${HEAD_CLASS} text-right`}>Would open</th>
              <th className={`${HEAD_CLASS} text-right`}>Goes to</th>
              <th className={`${HEAD_CLASS} text-right`}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {AN03_ROWS.map((row) => (
              <tr key={row.condition} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.condition}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-4">{row.threshold}</td>
                <td className={`px-4 py-3 text-right font-mono ${AN_TONE_CLASS[row.currentlyTone]}`}>{row.currently}</td>
                <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.wouldOpenTone]}`}>{row.wouldOpen}</td>
                <td className={`px-4 py-3 text-right ${row.goesTo === "nobody" ? "text-rose" : "text-ink-3"}`}>{row.goesTo}</td>
                <td className="px-4 py-3 text-right">
                  {row.editable ? (
                    <button type="button" onClick={() => setEditOpen(true)} className="text-[10.5px] font-semibold text-ultra hover:underline">
                      edit
                    </button>
                  ) : (
                    <span className="text-[10.5px] text-ink-4">edit</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="The fourth condition is the most valuable rule in the workspace and it has nowhere to route">
        "A release ships in a market that lost this before" would have caught Kenya in June and would catch Ghana
        on 14 September. It has no owner because a release belongs to Engineering, a market belongs to whoever
        runs it, and the loss belongs to Retain — three people, no single one of whom owns the condition. It
        fires in twenty-seven days into an empty field.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What an agent may and may not do with its own thresholds</p>
        <AgentDetailKvList rows={AN03_KV} />
      </section>

      <EditThresholdModal open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};

export default ConditionsRoute;
