import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { FunnelKvList } from "@/pages/revenue/funnel/kv-list";
import { FN10_EVENT_ROWS, FN10_SAVE_ROWS, FN_CHIP_TONE, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** FN10 — step 2 of the "Define a step" wizard. */
export function StepEvent() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Which event fires this step?</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Event</th>
                <th className={HEAD_CLASS}>Last seen</th>
                <th className={`${HEAD_CLASS} text-right`}>Volume · 30 days</th>
                <th className={`${HEAD_CLASS} text-right`}>Markets</th>
                <th className={HEAD_CLASS}>Fit</th>
              </tr>
            </thead>
            <tbody>
              {FN10_EVENT_ROWS.map((row) => (
                <tr key={row.event} className={`border-b border-line last:border-0 ${row.selected ? "bg-ultra-bg/40" : ""}`}>
                  <td className="px-4 py-3 font-mono text-[10.5px] font-semibold text-ink">{row.event}</td>
                  <td className="px-4 py-3 text-ink-4">{row.lastSeen}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.volumeTone]}`}>{row.volume}</td>
                  <td className={`px-4 py-3 text-right ${FN_TONE_CLASS[row.marketsTone]}`}>{row.markets}</td>
                  <td className="px-4 py-3">
                    {row.selected ? <Chip tone={FN_CHIP_TONE[row.fitTone]}>{row.fit}</Chip> : <span className={FN_TONE_CLASS[row.fitTone]}>{row.fit}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="You are mapping a step to an event that has never fired, and that is allowed">
        `checkout.fee_shown` does not exist. Mapping to it now means the step is defined, the gap is named, and the
        request in Handoff points at a field the funnel is already waiting for. The alternative on offer —
        `checkout.total_updated`, which fires in one market on any change — would produce a number tomorrow, and the
        number would be wrong in a way nobody could see.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens on save</p>
        <FunnelKvList rows={FN10_SAVE_ROWS} />
      </section>
    </div>
  );
}
