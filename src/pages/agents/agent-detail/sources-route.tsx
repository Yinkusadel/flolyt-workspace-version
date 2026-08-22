import { Link } from "react-router-dom";

import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AgentDetailTabs } from "@/pages/agents/agent-detail/tabs";
import { AN04_ROWS, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AN04 — /agent-detail/sources, "What it reads". */
const SourcesRoute = () => {
  return (
    <div className="space-y-8">
      <AgentHeader subtitle="Four sources · one of them is why it can see the fee change at all" />

      <AgentDetailTabs active="What it reads" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[920px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Source</th>
              <th className={`${HEAD_CLASS} text-right`}>Rows</th>
              <th className={`${HEAD_CLASS} text-right`}>Freshness</th>
              <th className={`${HEAD_CLASS} text-right`}>Access</th>
              <th className={HEAD_CLASS}>What it uses it for</th>
              <th className={`${HEAD_CLASS} text-right`}>If it fails</th>
            </tr>
          </thead>
          <tbody>
            {AN04_ROWS.map((row) => (
              <tr key={row.source} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                <td className="px-4 py-3 text-right font-mono text-ink-3">{row.rows}</td>
                <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.freshnessTone]}`}>{row.freshness}</td>
                <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.accessTone]}`}>{row.access}</td>
                <td className="px-4 py-3 text-ink-3">{row.use}</td>
                <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.ifFailsTone]}`}>{row.ifFails}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="The releases table was connected on 2 August and it is the reason this agent could date the fee change">
        Before that it could see a fall on 11 March and could not say what happened that week. One read-only
        connection turned five months of association into a causal finding in four hours. It is the cheapest
        thing anybody did in this workspace and it is one row in this table.
      </Callout>

      <Callout tone="teal" title="It reads no personal data and does not need any">
        Names, addresses, emails and phone numbers are not in any of the four sources it can reach. It reasons
        about cohorts, so it needs counts and dates, and its credential was scoped to that rather than to
        everything the database contains. Governance shows the scope; this screen shows what it actually uses.
      </Callout>

      <p className="text-[11px] text-ink-4">
        <Link to="/agent-detail/limits" className="font-semibold text-ultra hover:underline">
          See the credential
        </Link>
      </p>
    </div>
  );
};

export default SourcesRoute;
