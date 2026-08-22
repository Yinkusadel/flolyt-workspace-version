import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AgentDetailTabs } from "@/pages/agents/agent-detail/tabs";
import { AN05_ROWS, AN_CHIP_TONE, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AN05 — /agent-detail/findings. */
const FindingsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <AgentHeader subtitle="Nineteen findings · eleven became rooms and two have been tested" />
        </div>
        <div className="flex shrink-0 justify-end">
          <Button asChild type="button" size="sm">
            <Link to="/agent-detail/findings/1">Open one</Link>
          </Button>
        </div>
      </div>

      <AgentDetailTabs active="Findings" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[920px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Finding</th>
              <th className={`${HEAD_CLASS} text-right`}>Claim</th>
              <th className={`${HEAD_CLASS} text-right`}>Confidence</th>
              <th className={`${HEAD_CLASS} text-right`}>n</th>
              <th className={`${HEAD_CLASS} text-right`}>Became</th>
              <th className={`${HEAD_CLASS} text-right`}>Tested</th>
            </tr>
          </thead>
          <tbody>
            {AN05_ROWS.map((row) => (
              <tr key={row.finding} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">
                  {row.id ? (
                    <Link to={`/agent-detail/findings/${row.id}`} className="text-ultra hover:underline">
                      {row.finding}
                    </Link>
                  ) : (
                    row.finding
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={AN_CHIP_TONE[row.claimTone]}>{row.claim}</Chip>
                </td>
                <td className={`px-4 py-3 text-right font-mono ${AN_TONE_CLASS[row.confidenceTone]}`}>{row.confidence}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.n}</td>
                <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.becameTone]}`}>{row.became}</td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={AN_CHIP_TONE[row.testedTone]}>{row.tested}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Its one wrong claim is on this list with the same weight as the four that were right">
        Day of week was stated at 3 of 5 confidence, became a playbook, and was disproved by wave one running
        across every day of the week. The row is not removed, not greyed out and not moved to a history tab,
        because an agent whose mistakes disappear from its own findings list is an agent nobody can calibrate
        against.
      </Callout>

      <Callout tone="amber" title="Two of six findings here are the agent saying it cannot tell you something">
        The guest-checkout row is a finding of insufficient evidence, which is a real output rather than a gap.
        It became the most cited constraint in business memory. Counting only the confident findings would make
        this agent look more productive and considerably less useful.
      </Callout>
    </div>
  );
};

export default FindingsRoute;
