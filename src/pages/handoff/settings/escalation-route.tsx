import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { ESCALATION_LADDER, ESCALATION_RULES } from "@/pages/handoff/data";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H11 — `/settings/handoff-escalation`. */
export default function EscalationRoute() {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Handoff", to: "/handoff" }, { label: "Escalation" }]}
        title="Handoff escalation"
        subtitle="Seven stages · five cannot be turned off · two override the daily ranking"
        action={<Button onClick={() => toast.success("Policy saved")}>Save policy</Button>}
      />

      <Callout tone="rose" title="This policy did not exist until 2 August, which is why one obligation went overdue silently">
        Before it, an obligation could be accepted, dated and then missed with nothing happening at all. No rule
        covered "passed its date", and the daily list ranked by revenue rather than by broken commitments. Both are
        covered below.
      </Callout>

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          What happens as an obligation ages
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What happens</th>
                <th className={HEAD_CLASS}>Who is told</th>
                <th className={HEAD_CLASS}>Where it appears</th>
                <th className={HEAD_CLASS}>Can it be turned off?</th>
              </tr>
            </thead>
            <tbody>
              {ESCALATION_LADDER.map((row) => (
                <tr key={row.when} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.who}</td>
                  <td className={cn("px-4 py-3 whitespace-nowrap", row.whereTone ? TONE_TEXT_CLASS[row.whereTone] : "text-ink-4")}>
                    {row.where}
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.canTurnOffTone}>{row.canTurnOff}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          Two rules that override ranking
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {ESCALATION_RULES.map((rule) => (
            <div key={rule.eyebrow} className="rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">{rule.eyebrow}</p>
              <h3 className="mt-1.5 text-[12.5px] font-semibold text-ink">{rule.title}</h3>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{rule.body}</p>
              <p className={cn("mt-3 border-t border-dashed border-line pt-3 text-[10.5px] font-semibold", TONE_TEXT_CLASS[rule.footnoteTone])}>
                {rule.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
