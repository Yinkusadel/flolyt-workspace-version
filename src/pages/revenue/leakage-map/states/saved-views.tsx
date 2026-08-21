import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { LeaksTabs } from "@/pages/revenue/leakage-map/tabs";
import { LeaksKvList } from "@/pages/revenue/leakage-map/kv-list";
import { LK07_FILTER_ROWS, LK07_VIEW_ROWS, LK_TONE_CLASS } from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK07 — /leakage-map?view= — shown with "The map" tab still active, per the export's own footer. */
export function SavedViewsState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Leakage map</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Saved views · shared filters over the same 151 days</p>
      </div>

      <LeaksTabs active="The map" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Saved views</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>View</th>
                <th className={HEAD_CLASS}>What it holds</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Lines</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Realised</th>
                <th className={HEAD_CLASS}>Shared with</th>
                <th className={HEAD_CLASS}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {LK07_VIEW_ROWS.map((row) => (
                <tr key={row.view} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.view}</td>
                  <td className="px-4 py-3 text-ink-2">{row.holds}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.lines}</td>
                  <td className={`px-4 py-3 text-right font-mono ${LK_TONE_CLASS[row.realisedTone]}`}>{row.realised}</td>
                  <td className="px-4 py-3 text-ink-3">{row.sharedWith}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.owner.department] }} />
                      {row.owner.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Filters · what each one removes and what it cannot</p>
        <LeaksKvList rows={LK07_FILTER_ROWS} />
      </section>

      <Callout tone="amber" title="Two filters are missing on purpose and the screen says which">
        You cannot hide a line that says Unavailable, and you cannot sort this table by how long something has been
        leaking. Both would make the view calmer. Hiding unavailable turns a gap into a zero, and sorting by age
        would put a nine-month ₦4M line above a three-week ₦437M one — the exact mistake this map exists to stop
        being made in a slide.
      </Callout>
    </div>
  );
}
