import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { SegmentsKvList } from "@/pages/customers/segments/kv-list";
import { SG10_AUTO_EXCLUDED_ROWS, SG10_MANUAL_KV_ROWS, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG10 — step 2, "Who is left out". */
export function StepExcluded() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Excluded automatically · not your decision, and not overridable</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Excluded</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Set by</th>
                <th className={HEAD_CLASS}>Overridable</th>
              </tr>
            </thead>
            <tbody>
              {SG10_AUTO_EXCLUDED_ROWS.map((row) => (
                <tr key={row.excluded} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.excluded}</td>
                  <td className={`px-4 py-3 text-right font-mono ${SG_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.setBy}</td>
                  <td className="px-4 py-3 text-rose">{row.overridable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Excluded by you · with a reason, kept on the segment</p>
        <SegmentsKvList rows={SG10_MANUAL_KV_ROWS} />
      </section>

      <Callout tone="rose" title="Your exclusions and the product's exclusions are listed separately and behave differently">
        The five above cannot be turned off by anyone, including Ada, except the suppression policy that is hers.
        Yours can be edited later, and each keeps the reason you typed. Mixing the two into one list would make a
        consent rule look like a preference, and somebody would eventually try to argue with it.
      </Callout>
    </div>
  );
}
