import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { SNOOZED_ROWS, SNOOZE_RULES } from "@/pages/everyday/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T09 — everything the current user has snoozed, regardless of scope. */
const SnoozedRoute = () => {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "What to do today", to: "/what-to-do-today" }, { label: "Snoozed" }]}
        title="Snoozed"
        subtitle="Five items · one has been snoozed twice · ₦31M sitting behind it"
      />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Snoozed by you · everything here has a reason and a return date
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Item</th>
                <th className={HEAD_CLASS}>Snoozed because</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Snoozed</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Returns</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Cost of waiting</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Times</th>
              </tr>
            </thead>
            <tbody>
              {SNOOZED_ROWS.map((row) => (
                <tr key={row.item} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.item}</td>
                  <td className="px-4 py-3.5 text-ink-3">{row.because}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4 whitespace-nowrap">{row.snoozedAgo}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.returnsTone ? TONE_TEXT_CLASS[row.returnsTone] : "text-ink-4")}>
                    {row.returns}
                  </td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.costTone ? TONE_TEXT_CLASS[row.costTone] : "text-ink-4")}>
                    {row.cost}
                  </td>
                  <td className={cn("px-4 py-3.5 text-right font-mono", row.timesTone ? TONE_TEXT_CLASS[row.timesTone] : "text-ink-4")}>
                    {row.times}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="rose" title="One of these has been snoozed twice, and that is what this screen exists to show">
        The Ghana room was snoozed on 4 August until the 11th, then snoozed again on the 11th until the 18th. Two
        weeks of a ₦31M room with nobody on it, in a form that never appeared in a digest and never showed in the
        amber badge. Both snoozes were reasonable. The pattern is not.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The rules</p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {SNOOZE_RULES.map((rule) => (
            <div key={rule.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] text-ink-2">{rule.label}</span>
              <span className={cn("font-mono text-[10px]", rule.tone ? TONE_TEXT_CLASS[rule.tone] : "text-ink-4")}>
                {rule.note}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Callout tone="teal" title="Without this screen, a snooze is indistinguishable from a decision">
        And the fastest route to a clean list becomes making expensive things disappear. Everything here is still
        costing money — the screen just stops it costing money invisibly.
      </Callout>
    </div>
  );
};

export default SnoozedRoute;
