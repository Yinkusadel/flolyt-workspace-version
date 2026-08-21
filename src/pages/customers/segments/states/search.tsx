import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SG08_FILTER_ROWS, SG08_RESULT_ROWS, SG_CHIP_TONE, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG08 — /segments?q=lapsed. */
export function SearchState({ query }: { query: string }) {
  return (
    <div className="space-y-8">
      <div className="rounded-card border border-line bg-white p-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[14px] font-semibold text-ink">{query || "lapsed"}</span>
          <span className="font-mono text-[10px] text-ink-4">{SG08_RESULT_ROWS.length} results · 0.2s</span>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Matches</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Result</th>
                <th className={HEAD_CLASS}>Kind</th>
                <th className={`${HEAD_CLASS} text-right`}>Size</th>
                <th className={HEAD_CLASS}>State</th>
                <th className={HEAD_CLASS}>Why it matched</th>
              </tr>
            </thead>
            <tbody>
              {SG08_RESULT_ROWS.map((row) => (
                <tr key={row.result} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink-2">{row.result}</td>
                  <td className="px-4 py-3">
                    <Chip tone={SG_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${SG_TONE_CLASS[row.sizeTone]}`}>{row.size}</td>
                  <td className="px-4 py-3 text-ink-4">{row.state}</td>
                  <td className="px-4 py-3 text-ink-4">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The last result is a note somebody wrote, and it is the most useful row">
        Three of these segments call themselves lapsed and mean three different things — no order in 90 days, no
        order since a date, and no order in two cycles. Zainab wrote that down in April. Returning it alongside the
        segments is the only thing on this screen that stops somebody picking whichever one is nearest.
      </Callout>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className={EYEBROW_CLASS}>Filters</p>
          <Button type="button" variant="outline" size="sm" onClick={() => toast.success("Search saved")}>
            Save this search
          </Button>
        </div>
        <SegmentsKvList rows={SG08_FILTER_ROWS} />
      </section>
    </div>
  );
}
