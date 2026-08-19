import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { QUARTER_CLOSE_CARDS, QUARTER_CLOSE_ROWS } from "@/pages/everyday/goals/quarter-close-data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** G15 — Quarter close. */
export function QuarterCloseRoute() {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Goals", to: "/goals" }, { label: "Q1 close" }]}
        title="Q1 close"
        subtitle="Two met, two missed, one never settable · every changed target is shown"
        action={<Button onClick={() => toast.success("Exported for the board")}>Export for the board</Button>}
      />

      <div className="rounded-card border border-line bg-paper-2 p-4">
        <h3 className="text-[12.5px] font-semibold text-ink">
          Q1 closed 31 March · two goals met, two missed, one never had a baseline
        </h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
          Every target is compared to the number that was in force when the work was done, not to the number it
          ended on.
        </p>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Goal</th>
              <th className={HEAD_CLASS}>Baseline</th>
              <th className={HEAD_CLASS}>Target</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Closed at</th>
              <th className={HEAD_CLASS}>Result</th>
              <th className={HEAD_CLASS}>Target changed?</th>
              <th className={HEAD_CLASS}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {QUARTER_CLOSE_ROWS.map((row) => (
              <tr key={row.goal} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.goal}</td>
                <td className="px-4 py-3 font-mono text-ink-3">{row.baseline}</td>
                <td className={cn("px-4 py-3 font-mono", row.targetTone ? TONE_TEXT_CLASS[row.targetTone] : "text-ink")}>
                  {row.target}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono", TONE_TEXT_CLASS[row.closedAtTone])}>
                  {row.closedAt}
                </td>
                <td className={cn("px-4 py-3 font-semibold", TONE_TEXT_CLASS[row.resultTone])}>{row.result}</td>
                <td className={cn("px-4 py-3", TONE_TEXT_CLASS[row.targetChangedTone])}>{row.targetChanged}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <ActorAvatar actor={{ kind: "human", person: row.owner }} size="sm" />
                    <span className="text-ink-2">{row.owner.name.split(" ")[0]}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="The repeat-rate goal was lowered from 36.4% to 32.0% on 12 August and the close says so">
        It closed at 31.4%, which misses the revised target and would have missed the original by five points. Both
        numbers are on this screen. A quarter close that only shows the final target is a quarter close that can
        always be made to look better in August.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What the quarter is judged on, beyond hit or missed
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {QUARTER_CLOSE_CARDS.map((card) => (
            <div key={card.title} className="rounded-card border border-line bg-paper p-4">
              <span className={cn("font-mono text-[9px] font-semibold tracking-[0.6px]", TONE_TEXT_CLASS[card.tone])}>
                {card.label.toUpperCase()}
              </span>
              <h3 className="mt-2 text-[13px] font-semibold text-ink">{card.title}</h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
              <p className={cn("mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px]", TONE_TEXT_CLASS[card.tone])}>
                {card.bottomLine}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
