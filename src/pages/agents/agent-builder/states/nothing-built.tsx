import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentBuilderTabs } from "@/pages/agents/agent-builder/tabs";
import { AB01_EMPTY, AB01_ROWS, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

/** AB01 — before anything has been built. Wired but unreachable with AGENT_BUILDER_STATE's current default. */
export function NothingBuiltState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Agent Builder</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">0 built · nothing built here yet</p>
      </div>

      <AgentBuilderTabs active="Built here" />

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">{AB01_EMPTY.heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">{AB01_EMPTY.body}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button asChild type="button">
            <Link to="/agent-builder/new">Build an agent</Link>
          </Button>
          <Link to="/business-memory" className="text-[11.5px] font-semibold text-ink-3 hover:text-ink">
            See what is unwatched
          </Link>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">{AB01_EMPTY.footnote}</p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the twelve do not watch</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Unwatched</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Why none of the twelve covers it</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Who would own it</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Worth</th>
              </tr>
            </thead>
            <tbody>
              {AB01_ROWS.map((row) => (
                <tr key={row.unwatched} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.unwatched}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.ownerTone]}`}>{row.owner}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AB_TONE_CLASS[row.worthTone]}`}>{row.worth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The first row is why this section exists at all">
        Repeat & Decay suggested that condition in June, after Kenya moved the same way Nigeria had. It has no
        owner because a release belongs to Sam, a market belongs to whoever runs it and the loss belongs to
        Retain. It sits inside one agent, routing nowhere, and it fires in twenty-seven days.
      </Callout>
    </div>
  );
}
