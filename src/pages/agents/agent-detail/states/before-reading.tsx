import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AN01_EMPTY, AN01_ROWS } from "@/pages/agents/agent-detail/data";

/** AN01 — before it has read anything. Wired but unreachable with AGENT_DETAIL_STATE's current default. */
export function BeforeReadingState() {
  return (
    <div className="space-y-8">
      <AgentHeader subtitle={AN01_EMPTY.subtitle} />

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">{AN01_EMPTY.heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">{AN01_EMPTY.body}</p>
        <div className="mt-5 flex justify-center">
          <Button type="button" onClick={() => toast.success("First run started · about three hours")}>
            Start the first run
          </Button>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it will be able to do, and what it will not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">It will</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Example</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">It will never</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Reason</th>
              </tr>
            </thead>
            <tbody>
              {AN01_ROWS.map((row) => (
                <tr key={row.will} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.will}</td>
                  <td className="px-4 py-3 text-ink-3">{row.example}</td>
                  <td className="px-4 py-3 text-ink-3">{row.never}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A new agent's credentials are read-only and that is checkable rather than promised">
        The connection it was given cannot write to orders, customers, tickets or ad_spend, so the sentence "it
        will never write to any of them" is a fact about the credential rather than a rule it is expected to
        follow. Governance shows the credential and what it can reach.
      </Callout>
    </div>
  );
}
