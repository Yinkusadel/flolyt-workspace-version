import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { LK01_AGENT_ROWS, LK_TONE_CLASS } from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK01 — before the 1 January baseline locks. Wired but unreachable with LEAKAGE_MAP_STATE's current default. */
export function NothingMeasuredState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Leakage map</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Connected 12 December · four days of live data · no baseline yet</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">
          Nothing has leaked yet, because nothing has been measured yet
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Orders and refunds are connected and reading correctly. A leak is a distance from something, and there is
          nothing yet to be distant from. This map fills on 1 January when the first baselines lock.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button">Lock a baseline</Button>
          <Button type="button" variant="outline">
            See what is connected
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Eighteen months of orders were imported. Four days of live data is not a baseline, and this screen says so
          until 1 January.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is running while this is empty</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[560px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Reading</th>
                <th className={HEAD_CLASS}>Since</th>
                <th className={HEAD_CLASS}>Can it price a leak yet?</th>
              </tr>
            </thead>
            <tbody>
              {LK01_AGENT_ROWS.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="agent" initials={row.agent.initials} size="sm" />
                      {row.agent.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.reading}</td>
                  <td className="px-4 py-3 text-ink-4">{row.since}</td>
                  <td className={`px-4 py-3 ${LK_TONE_CLASS[row.canPriceTone]}`}>{row.canPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="neutral" title="A map with an estimate on it is worse than an empty one">
        Every figure here is a comparison — against a baseline, a holdout, or a market where a change did not ship.
        A number produced before there is anything to compare against would sit in the same column, in the same
        typeface, as one produced four months later against a real control. There would be no way to tell them
        apart afterwards, so there is nothing here now.
      </Callout>
    </div>
  );
}
