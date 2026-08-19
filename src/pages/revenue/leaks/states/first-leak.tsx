import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { REPEAT_DECAY } from "@/pages/everyday/rooms/data";
import { LeaksKvList } from "@/pages/revenue/leaks/kv-list";
import { LK02_MISSING_ROWS, LK02_WHAT_NEXT_ROWS } from "@/pages/revenue/leaks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK02 — the first finding, 27 days since 4 March. Wired but unreachable with LEAKAGE_MAP_STATE's current default. */
export function FirstLeakState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Leakage map</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            One finding · dated 4 March · ₦96M elapsed · claim type stated as association
          </p>
        </div>
        <Button type="button" size="sm">
          Open a room
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-card border border-ultra-border bg-ultra-bg p-4">
        <PersonAvatar kind="agent" initials={REPEAT_DECAY.initials} />
        <div>
          <p className="text-[14px] font-semibold text-ink">Repeat & Decay found the first thing worth money</p>
          <p className="mt-1.5 text-[11px] text-ink-2">
            Repeat rate was 37.4% before 4 March and 27.2% after. The change is dated to a single week and holds in
            Nigeria and Kenya but not in the UK or Ghana.
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-ultra">
            It has not named a cause. It has named a date, and it says so in those words.
          </p>
        </div>
      </div>

      <KpiCards
        items={[
          { eyebrow: "Realised loss so far", value: "₦96M", tone: "rose", note: "27 days at ₦3.6M" },
          { eyebrow: "Claim type", value: "Association", tone: "ink", note: "not causal · stated" },
          { eyebrow: "Baseline · locked 1 Jan", value: "37.1%", tone: "ink", note: "before the change" },
          { eyebrow: "Markets affected", value: "2 of 4", tone: "amber", note: "NG and KE only" },
        ]}
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it would take to make this a causal claim</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[620px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Missing</th>
                <th className={HEAD_CLASS}>Why it matters</th>
                <th className={HEAD_CLASS}>Who has it</th>
                <th className={HEAD_CLASS}>Asked</th>
              </tr>
            </thead>
            <tbody>
              {LK02_MISSING_ROWS.map((row) => (
                <tr key={row.missing} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.missing}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="human" initials={row.who.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.who.department] }} />
                      {row.who.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-4">{row.asked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The first number on this map is deliberately not the biggest one">
        ₦96M is what has been lost since 4 March, not what the change will cost over a year. Flolyt reports elapsed
        loss and refuses to annualise on day one, because annualising twenty-seven days of a trend is how a ₦96M
        observation becomes a ₦1.3B claim nobody can defend in the meeting where it matters.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens next, and what does not</p>
        <LeaksKvList rows={LK02_WHAT_NEXT_ROWS} />
      </section>
    </div>
  );
}
