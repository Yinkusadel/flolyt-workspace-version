import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { BusinessMemoryKvList } from "@/pages/knowledge/business-memory/kv-list";
import { BM_CHIP_TONE, BM_TONE_CLASS, ME08_NOT_ROWS, ME08_NOTE, ME08_RESULT_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME08 — /business-memory?q=, the one index state with no tab bar. */
export function SearchState({ query }: { query: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Search across learnings, rejections, rooms and notes</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-4" />
        <Input value={query} readOnly className="h-11 bg-paper pl-9 text-[13px] font-semibold" />
        <span className="absolute top-1/2 right-3.5 -translate-y-1/2 font-mono text-[10px] text-ink-4">
          {ME08_RESULT_ROWS.length} results · 0.2s
        </span>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Arrived here from Acquire · history</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Result</th>
                <th className={HEAD_CLASS}>Kind</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
                <th className={`${HEAD_CLASS} text-right`}>Cited</th>
                <th className={HEAD_CLASS}>Why it matched</th>
              </tr>
            </thead>
            <tbody>
              {ME08_RESULT_ROWS.map((row) => (
                <tr key={row.result} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.result}</td>
                  <td className="px-4 py-3">
                    <Chip tone={BM_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                  <td className={`px-4 py-3 text-right ${BM_TONE_CLASS[row.stateTone]}`}>{row.state}</td>
                  <td className={`px-4 py-3 text-right font-mono ${BM_TONE_CLASS[row.citedTone]}`}>{row.cited}</td>
                  <td className="px-4 py-3 text-ink-4">{row.matched}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The last result is a note about a word and it is cited more often than four of the learnings above it">
        {ME08_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What search does not do</p>
        <BusinessMemoryKvList rows={ME08_NOT_ROWS} />
      </section>
    </div>
  );
}
