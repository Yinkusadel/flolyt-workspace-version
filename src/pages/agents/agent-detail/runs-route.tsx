import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AgentDetailTabs } from "@/pages/agents/agent-detail/tabs";
import { AskModal } from "@/pages/agents/agent-detail/modals/ask-modal";
import { AN07_ROWS, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AN07 — /agent-detail/runs. */
const RunsRoute = () => {
  const [askOpen, setAskOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <AgentHeader subtitle="119 runs this month · ₦2,140 · one in progress" />
        </div>
        <div className="flex shrink-0 justify-end">
          <Button type="button" onClick={() => setAskOpen(true)}>
            Ask it something
          </Button>
        </div>
      </div>

      <AgentDetailTabs active="Runs" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[920px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>When</th>
              <th className={HEAD_CLASS}>What it was doing</th>
              <th className={`${HEAD_CLASS} text-right`}>Turns</th>
              <th className={`${HEAD_CLASS} text-right`}>Rows</th>
              <th className={`${HEAD_CLASS} text-right`}>Cost</th>
              <th className={`${HEAD_CLASS} text-right`}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {AN07_ROWS.map((row) => (
              <tr key={row.when + row.doing} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-ink-4">{row.when}</td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {row.id ? (
                    <Link to={`/agent-detail/runs/${row.id}`} className="text-ultra hover:underline">
                      {row.doing}
                    </Link>
                  ) : (
                    row.doing
                  )}
                </td>
                <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.turnsTone]}`}>{row.turns}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.rows}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-4">{row.cost}</td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={row.outcomeTone === "ok" ? "teal" : row.outcomeTone === "warn" ? "amber" : "neutral"}>{row.outcome}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Most runs produce nothing and that is what a healthy agent looks like">
        117 of 119 runs this month ended with no finding at all. An agent that produced something every night
        would be an agent lowering its own bar, and the two runs that did produce something are the ones that
        cost ₦24 and ₦12 respectively. Nightly cost here is roughly the price of a cup of coffee a week.
      </Callout>

      <Callout tone="teal" title="The cancelled run is kept and marked partial rather than deleted">
        Ifeoma stopped it at turn two on 1 August because she wanted the releases join done first. The 1.1M rows
        it had read are kept, labelled partial, and cannot be cited as a complete read. Deleting it would leave
        an unexplained ₦8 and a gap in the nightly sequence that somebody would eventually investigate.
      </Callout>

      <AskModal open={askOpen} onOpenChange={setAskOpen} />
    </div>
  );
};

export default RunsRoute;
