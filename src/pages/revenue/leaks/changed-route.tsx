import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { LeaksTabs } from "@/pages/revenue/leaks/tabs";
import { LK09_MOVEMENT_ROWS, LK09_REVISION_ROWS, LK_TONE_CLASS } from "@/pages/revenue/leaks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK09 — /revenue/leaks/changed. */
const ChangedRoute = () => {
  return (
    <div className="space-y-8">
      <LeaksTabs active="What changed" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>This week · four movements, and none of them is a customer behaving differently</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Change</th>
                <th className={HEAD_CLASS}>Line</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Was</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Now</th>
                <th className={HEAD_CLASS}>Why it moved</th>
                <th className={HEAD_CLASS}>When</th>
              </tr>
            </thead>
            <tbody>
              {LK09_MOVEMENT_ROWS.map((row) => (
                <tr key={row.line} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.change}</td>
                  <td className="px-4 py-3 text-ink-2">{row.line}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.was}</td>
                  <td className={`px-4 py-3 text-right font-mono ${LK_TONE_CLASS[row.nowTone]}`}>{row.now}</td>
                  <td className={`px-4 py-3 ${LK_TONE_CLASS[row.whyTone]}`}>{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="A figure that goes down is not good news and is not shown as good news">
        Renew fell ₦12M because ₦12M of it was Churn's, counted twice. Nothing was recovered and no customer was
        helped. The row is neutral rather than green, because a ledger where corrections look like wins is a ledger
        people learn to correct in one direction.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Revisions in full · every figure that has ever changed keeps its history</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Line</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Revisions</th>
                <th className={HEAD_CLASS}>Most recent reason</th>
                <th className={HEAD_CLASS}>Direction</th>
                <th className={HEAD_CLASS}>Who signed it</th>
              </tr>
            </thead>
            <tbody>
              {LK09_REVISION_ROWS.map((row) => (
                <tr key={row.line} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.line}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.revisions}</td>
                  <td className="px-4 py-3 text-ink-2">{row.reason}</td>
                  <td className="px-4 py-3 text-ink-4">{row.direction}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="human" initials={row.who.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.who.department] }} />
                      {row.who.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="A withdrawn figure is not a deleted figure">
        Price's margin line has been revised four times and now reads Unavailable. Every previous value is still
        readable, with its date and the reason it stopped being true. Anyone who quoted ₦46M in June can find out
        here that it no longer holds, which is the whole reason revisions are kept rather than overwritten.
      </Callout>
    </div>
  );
};

export default ChangedRoute;
