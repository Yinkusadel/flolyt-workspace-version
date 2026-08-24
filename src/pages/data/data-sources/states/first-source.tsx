import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { DS02_FIELD_ROWS, DS02_STATS, DS_KPI_TONE, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS02 — three hours after the first source connected. Wired but unreachable with DATA_SOURCES_STATE's current default. */
export function FirstSourceState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Data sources</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1.24M rows in three hours · four fields of thirty-one · read-only</p>
      </div>

      <div className="flex items-start gap-4 rounded-card border border-teal-border bg-teal-bg p-5">
        <PersonAvatar kind="human" initials="SM" team={1} />
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-ink">Sam connected orders and 1.24 million rows arrived in three hours</h2>
          <p className="mt-1.5 text-[11px] text-ink-2">
            Eighteen months of history, four fields, read-only. It is the source almost everything else in this
            product depends on, and the only one connected today.
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-teal">
            Nothing can be said about any of it until a baseline locks on 1 January.
          </p>
        </div>
      </div>

      <KpiCards items={DS02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: DS_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Four fields taken of thirty-one available</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>Taken?</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>What it enables</th>
              </tr>
            </thead>
            <tbody>
              {DS02_FIELD_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-2">{row.field}</td>
                  <td className={`px-4 py-3 ${DS_TONE_CLASS[row.takenTone]}`}>{row.taken}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.enables}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Taking four fields of thirty-one is the decision this whole section is about">
        Everything available could have been taken in the same three hours at no extra cost. What that produces is
        an audit surface nobody can hold in their head and an agent access table that is meaningless because
        everything reads everything. The two fields that were declined are personal, and the one that is missing
        turns up in eleven blocked figures later.
      </Callout>
    </div>
  );
}
