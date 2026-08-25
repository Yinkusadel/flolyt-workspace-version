import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { IdentityTabs } from "@/pages/data/identity/tabs";
import { PeopleBar } from "@/pages/data/identity/people-bar";
import { ID03_PEOPLE_SEGMENTS, ID03_TOTAL_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID03 — the default "Who is a customer" state, and the /identity tab bar's home tab. */
export function WhoIsACustomerState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Four totals · the biggest one may be used for the least</p>
      </div>

      <IdentityTabs active="Who is a customer" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The four totals this workspace has, and what each may be used for</p>
        <div className="rounded-card border border-line bg-paper p-4">
          <PeopleBar segments={ID03_PEOPLE_SEGMENTS} />
        </div>
      </section>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Total</th>
              <th className={HEAD_CLASS}>What it is</th>
              <th className={HEAD_RIGHT_CLASS}>Figure</th>
              <th className={HEAD_CLASS}>May be used for</th>
              <th className={HEAD_CLASS}>May not</th>
            </tr>
          </thead>
          <tbody>
            {ID03_TOTAL_ROWS.map((row) => (
              <tr key={row.total} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.total}</td>
                <td className="px-4 py-3 text-ink-2">{row.what}</td>
                <td className={`px-4 py-3 text-right font-mono ${ID_TONE_CLASS[row.figureTone]}`}>{row.figure}</td>
                <td className="px-4 py-3 text-ink-2">{row.mayUse}</td>
                <td className={`px-4 py-3 ${ID_TONE_CLASS[row.mayNotTone]}`}>{row.mayNot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="The largest of the four totals is the one that may be used for the least">
        4.2M is the number that appears on a website and in a board deck, and it is the only one of the four that
        cannot be a denominator for anything. The gaps between these totals are where most reporting errors in
        this category originate, which is why all four appear together with a permitted-use column rather than as
        one headline.
      </Callout>

      <Callout tone="ultra" title="Identifiable and measurable are the same figure here and will not always be">
        In this workspace every identifiable customer can also be joined to transactions. In a business with an
        offline channel, a partner-sold product or a marketplace, they diverge — and every Revenue figure resolves
        through measurable while every cohort resolves through identifiable.
      </Callout>
    </div>
  );
}
