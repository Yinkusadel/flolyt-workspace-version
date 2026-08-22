import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { MK01_ROWS, MK_CHIP_TONE } from "@/pages/agents/marketplace/data";

/** MK01 — before anything has been installed. Wired but unreachable with MARKETPLACE_STATE's current default. */
export function NothingInstalledState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Marketplace</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">34 available · nothing installed · three things that never arrive with an agent</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been installed from outside this workspace</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Thirty-four agents are published by Flolyt and eleven verified partners. Every one of them arrives here
          with no record, no results and no benchmark from anybody else's business — the same wall the community
          has.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button">Browse the marketplace</Button>
          <Button type="button" variant="outline">
            What arrives and what does not
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          An installed agent reads your data and starts at zero. Nothing about other companies comes with it.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What can and cannot cross into this workspace</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">What</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Example</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Arrives?</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Why</th>
              </tr>
            </thead>
            <tbody>
              {MK01_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3 text-ink-3">{row.example}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={MK_CHIP_TONE[row.arrivesTone]}>{row.arrives}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The bottom three are what every marketplace has and this one refuses">
        Ratings, success rates and testimonials are all the same thing — other companies' outcomes, averaged,
        sitting next to an install button. Benchmarks refuses external figures on every screen and the community
        refuses to let results travel. A marketplace with stars would quietly undo both.
      </Callout>
    </div>
  );
}
