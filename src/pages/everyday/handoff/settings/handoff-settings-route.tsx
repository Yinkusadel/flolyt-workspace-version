import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { HANDOFF_CARRIES, HANDOFF_TRIGGERS } from "@/pages/everyday/handoff/data";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H15 — `/settings/handoff`. */
export default function HandoffSettingsRoute() {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Handoff", to: "/handoff" }, { label: "Settings" }]}
        title="How handoffs are created"
        subtitle="Six triggers · four automatic, one manual, one that will never exist"
        action={<Button onClick={() => toast.success("Settings saved")}>Save</Button>}
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>A handoff is created when</th>
              <th className={HEAD_CLASS}>Automatic?</th>
              <th className={HEAD_CLASS}>Goes to</th>
              <th className={cn(HEAD_CLASS, "text-right")}>This quarter</th>
              <th className={HEAD_CLASS}>Can you change it?</th>
            </tr>
          </thead>
          <tbody>
            {HANDOFF_TRIGGERS.map((row) => (
              <tr key={row.trigger} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.trigger}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.automaticTone}>{row.automatic}</Chip>
                </td>
                <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.goesTo}</td>
                <td className="px-4 py-3 text-right text-ink-2">{row.quarter}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.canChangeTone}>{row.canChange}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="An agent can draft a handoff and can never create one">
        Repeat &amp; Decay drafted four obligations from the delivery-fee decision. A person reviewed them, removed
        none, and created them. An agent that could oblige another team on its own would be an agent that can
        assign work across the company without anybody agreeing to it.
      </Callout>

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          What a handoff always carries
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {HANDOFF_CARRIES.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] text-ink-3">{row.label}</span>
              <span className={cn("text-[10.5px] font-medium sm:text-right", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink-2")}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Callout tone="teal" title="The date belongs to the person accepting, not the person asking">
        A room can say "this needs doing". It cannot say "by Tuesday". Whoever accepts sets the date, because a
        deadline imposed by somebody with no visibility of your other 41 obligations is a deadline that gets
        ignored on day one.
      </Callout>
    </div>
  );
}
