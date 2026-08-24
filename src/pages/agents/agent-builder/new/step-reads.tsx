import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AB05_ROWS, AB_CHIP_TONE, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AB05 — step 2, "What it reads". */
export function StepReads() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Sources · read-only, and you cannot grant more than you have</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>Rows</th>
                <th className={`${HEAD_CLASS} text-right`}>Your access</th>
                <th className={HEAD_CLASS}>Grant to this agent</th>
                <th className={HEAD_CLASS}>What it would use it for</th>
              </tr>
            </thead>
            <tbody>
              {AB05_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.rows}</td>
                  <td className={`px-4 py-3 text-right ${AB_TONE_CLASS[row.accessTone]}`}>{row.access}</td>
                  <td className="px-4 py-3">
                    <Chip tone={AB_CHIP_TONE[row.grantTone]}>{row.grant}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="You cannot give an agent access you do not have yourself">
        Ifeoma cannot read the payments table, so an agent she builds cannot either — the grant is derived from
        her own credential rather than requested from an administrator. It means a built agent can never quietly
        become a way around somebody's data access, and it means the person who knows what to watch is the
        person whose reach limits it.
      </Callout>

      <Callout tone="teal" title="Two sources are deliberately not granted and the form shows what they would have been for">
        This agent does not need to see a single customer or a single order to do its job. Granting them anyway
        would be free, invisible and would make the audit line for this agent longer than the thing it watches.
        The default is nothing, and each grant is a decision with a stated use.
      </Callout>
    </div>
  );
}
