import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { TM01_TABLE, TM_CHIP_TONE } from "@/pages/agents/ai-teammates/data";

/** TM01 — before any agent has started reading. Wired but unreachable with TEAMMATES_STATE's current default. */
export function NobodyReadingState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">AI Teammates</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Twelve available · none reading · five things they will never do</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">No agent is reading anything yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Twelve agents are available. Each one reads a specific set of sources, watches for specific conditions,
          and produces findings that route to a named person. None of them can send anything, approve anything or
          decide anything, at any point, on any plan.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button">Start the first agent</Button>
          <Button type="button" variant="outline">
            What an agent can and cannot do
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          An agent that has read nothing has no opinions, and this screen would rather say so than show twelve cards.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What starting one means</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">It will</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Always</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">It will never</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Ever</th>
              </tr>
            </thead>
            <tbody>
              {TM01_TABLE.map((row) => (
                <tr key={row.itWill} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{row.itWill}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={TM_CHIP_TONE[row.always]}>yes</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.itWillNever}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={TM_CHIP_TONE[row.ever]}>no</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The right-hand column is the product, not a safety notice">
        Nothing on it is a setting, a permission level or an enterprise option. An agent in this workspace reads,
        states and routes — and the whole of the rest of Flolyt is built on that being true, which is why it is the
        first thing this section says rather than something found later in a governance screen.
      </Callout>
    </div>
  );
}
