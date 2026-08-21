import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { IFEOMA } from "@/pages/everyday/rooms/data";
import { LensBar } from "@/pages/revenue/leakage-map/lens-bar";
import { LeaksTabs } from "@/pages/revenue/leakage-map/tabs";
import { CLAIM_CHIP_TONE, CLAIM_LABEL, LK11_BELOW_LINE_ROWS, LK11_HERS_ROWS, LK_TONE_CLASS } from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** LK11 — /leakage-map?as=owner, the "My stage" lens for Ifeoma Nwosu (Retain). */
export function MyStageState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Leakage map</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Filtered to one stage · see everything to return to the full map</p>
      </div>

      <LensBar
        person={IFEOMA}
        holds="owns Retain · 14 rooms"
        body="Showing 1 stage of 10. Seven stages she does not own are hidden; two that feed Retain are shown below the line and labelled."
      />

      <LeaksTabs active="The map" />

      <KpiCards
        items={[
          { eyebrow: "Retain · realised loss", value: "₦437M", tone: "rose", note: "the largest single line" },
          { eyebrow: "Recovered here", value: "₦12M", tone: "amber", note: "one unmeasurable room" },
          { eyebrow: "Her open rooms", value: "6", tone: "ink", note: "of 14 across all sections" },
          { eyebrow: "Waiting on her", value: "1", tone: "amber", note: "wave three · 19 hours" },
        ]}
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Hers</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Line</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Realised</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">At stake</th>
                <th className={HEAD_CLASS}>Claim type</th>
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {LK11_HERS_ROWS.map((row) => (
                <tr key={row.line} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.line}</td>
                  <td className={`px-4 py-3 text-right font-mono ${LK_TONE_CLASS[row.realisedTone]}`}>{row.realised}</td>
                  <td className={`px-4 py-3 text-right font-mono ${LK_TONE_CLASS[row.atStakeTone]}`}>{row.atStake}</td>
                  <td className="px-4 py-3">
                    <Chip tone={CLAIM_CHIP_TONE[row.claimType]}>{CLAIM_LABEL[row.claimType]}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.room}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone === "muted" ? "neutral" : row.stateTone}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="border-t border-line pt-5">
        <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Below the line · not hers, but Retain cannot move without them
        </p>
      </div>

      <section className="space-y-3">
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Line</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Realised</th>
                <th className={HEAD_CLASS}>Why it is here</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={HEAD_CLASS}>What she can do</th>
              </tr>
            </thead>
            <tbody>
              {LK11_BELOW_LINE_ROWS.map((row) => (
                <tr key={row.line} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.line}</td>
                  <td className="px-4 py-3 text-right font-mono text-rose">{row.realised}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3">
                    {row.owner ? <span className="text-ink-2">{row.owner.name.split(" ")[0]}</span> : <Chip tone="rose">nobody</Chip>}
                  </td>
                  <td className={`px-4 py-3 ${LK_TONE_CLASS[row.whatSheCanDoTone]}`}>{row.whatSheCanDo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The lens hides seven stages and refuses to hide three of them">
        A filter that showed only Retain would be tidier and would hide ₦453M that determines whether Retain can
        move at all. The line is drawn, the three lines below it are labelled with why they are there, and two of
        them have no owner to hand them to — which is the actual answer to “why is my stage not improving”.
      </Callout>
      <Callout tone="ultra" title="Ownership filters the view and never the responsibility">
        Ifeoma cannot close the lines below the line and is not scored on them. They appear because a stage owner
        asking about her own numbers is asking a question that is answered three stages upstream, and a lens that
        pretended otherwise would make the workspace feel tidy and make her wrong.
      </Callout>
    </div>
  );
}
