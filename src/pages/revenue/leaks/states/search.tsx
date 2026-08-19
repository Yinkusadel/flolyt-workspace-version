import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { LeaksKvList } from "@/pages/revenue/leaks/kv-list";
import { LK08_NOT_SHOWN_ROWS, LK08_RESULT_ROWS, LK_CHIP_TONE, LK_TONE_CLASS } from "@/pages/revenue/leaks/data";

/** Only the release result resolves to a built `:id` reference page — every other result renders as plain text. */
const RESULT_HREF: Partial<Record<string, string>> = {
  "The delivery fee moved to checkout": "/revenue/leaks/delivery-fee-checkout",
};

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK08 — /revenue/leaks?q= — the export's own footer shows no tab bar here, unlike every other index state. */
export function SearchState({ query }: { query: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Search the map</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          17 results across releases, rooms, findings and fields · one suppressed
        </p>
      </div>

      <div className="flex items-center justify-between rounded-panel border border-line bg-white px-4.5 py-3">
        <span className="text-[13.5px] font-semibold text-ink">{query || "delivery fee"}</span>
        <span className="font-mono text-[10px] text-ink-4">17 results · 0.3s</span>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Matches, grouped by what kind of thing they are</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Result</th>
                <th className={HEAD_CLASS}>Kind</th>
                <th className={HEAD_CLASS}>Where</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Realised</th>
                <th className={HEAD_CLASS}>Match</th>
              </tr>
            </thead>
            <tbody>
              {LK08_RESULT_ROWS.map((row) => (
                <tr key={row.result} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    {RESULT_HREF[row.result] ? (
                      <Link to={RESULT_HREF[row.result]!} className="text-ultra hover:underline">
                        {row.result}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{row.result}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={LK_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.where}</td>
                  <td className={`px-4 py-3 text-right font-mono ${LK_TONE_CLASS[row.realisedTone]}`}>{row.realised}</td>
                  <td className="px-4 py-3 text-ink-4">{row.match}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The sixth result is a field that does not exist and it is still returned">
        `checkout.fee_shown` was searched for eleven times this month by four people. Returning nothing would
        suggest nobody had thought of it; returning the field with “not instrumented” beside it shows that everyone
        thought of it and it was never built. A search that only indexes what exists quietly hides the shape of
        what is missing.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Not shown here</p>
        <LeaksKvList rows={LK08_NOT_SHOWN_ROWS} />
      </section>
    </div>
  );
}
