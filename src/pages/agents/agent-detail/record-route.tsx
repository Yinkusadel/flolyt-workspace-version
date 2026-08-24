import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AgentDetailTabs } from "@/pages/agents/agent-detail/tabs";
import { AN09_ROWS, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AN09 — /agent-detail/record. */
const RecordRoute = () => {
  return (
    <div className="space-y-8">
      <AgentHeader subtitle="Two of nineteen claims have been tested against a holdout" />

      <AgentDetailTabs active="Record" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[880px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Claim</th>
              <th className={`${HEAD_CLASS} text-right`}>Stated at</th>
              <th className={`${HEAD_CLASS} text-right`}>Tested by</th>
              <th className={`${HEAD_CLASS} text-right`}>Result</th>
              <th className={HEAD_CLASS}>What it means</th>
            </tr>
          </thead>
          <tbody>
            {AN09_ROWS.map((row) => (
              <tr key={row.claim} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.claim}</td>
                <td className={`px-4 py-3 text-right font-mono ${AN_TONE_CLASS[row.statedAtTone]}`}>{row.statedAt}</td>
                <td className="px-4 py-3 text-right text-ink-3">{row.testedBy}</td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={row.resultTone === "ok" ? "teal" : row.resultTone === "risk" ? "rose" : "neutral"}>{row.result}</Chip>
                </td>
                <td className={`px-4 py-3 ${AN_TONE_CLASS[row.meansTone]}`}>{row.means}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="There is no accuracy score on this screen and there will not be one">
        Two tests is not a sample. One held, one did not, and turning that into 50% would be a number people
        quote about an agent that has produced the single most valuable finding in the workspace. The five rows
        are the record; the arithmetic on them is refused.
      </Callout>

      <Callout tone="amber" title="Its strongest claim rests on an accident nobody designed">
        The fee change never shipped to the UK, which is why this agent could call the fall causal rather than
        associated. Nobody decided to hold the UK back — a release flag missed it. The record says so on the
        row, because a claim whose control was an oversight is worth exactly as much as one whose control was
        planned, and is considerably less likely to be available next time.
      </Callout>
    </div>
  );
};

export default RecordRoute;
