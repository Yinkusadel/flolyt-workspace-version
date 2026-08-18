import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { ORDERING_RULES, TODAY_APPEARANCE_RULES } from "@/pages/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T15 — mounted at /settings/today per the export's own footer, not nested under /what-to-do-today. */
const SettingsTodayRoute = () => {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "What to do today", to: "/what-to-do-today" }, { label: "Settings" }]}
        title="What appears on your list"
        subtitle="Eight rules · four cannot be turned off, two cannot be turned on"
        action={<Button>Save</Button>}
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Appears on your list when</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Threshold</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Currently</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Can you change it?</th>
              <th className={cn(HEAD_CLASS, "text-right")}>State</th>
            </tr>
          </thead>
          <tbody>
            {TODAY_APPEARANCE_RULES.map((rule) => (
              <tr key={rule.when} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5 font-semibold text-ink">{rule.when}</td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  {rule.editableThreshold ? (
                    <input
                      defaultValue={rule.threshold}
                      className="w-32 rounded-control border border-line bg-paper px-2 py-1 text-right font-mono text-[11px] text-ink outline-none focus:border-ink-4"
                    />
                  ) : (
                    <span className="text-ink-4">{rule.threshold}</span>
                  )}
                </td>
                <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", rule.currentlyTone ? TONE_TEXT_CLASS[rule.currentlyTone] : "text-ink-4")}>
                  {rule.currently}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Chip tone={rule.canChangeTone}>{rule.canChange}</Chip>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Chip tone={rule.stateTone}>{rule.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Four of these cannot be turned off and two cannot be turned on">
        You can raise your ₦5M threshold and you can mute @-mentions. You cannot silence an approval you own, a
        conflict you own, an obligation you broke, or a room in your stage with nobody on it — because those are
        the four things this list exists for. And an agent narrating its own work will never appear here, at any
        threshold.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Ordering</p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {ORDERING_RULES.map((rule) => (
            <div key={rule.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] text-ink-2">{rule.label}</span>
              <span className={cn("font-mono text-[10px]", rule.tone ? TONE_TEXT_CLASS[rule.tone] : "text-ink-4")}>
                {rule.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsTodayRoute;
