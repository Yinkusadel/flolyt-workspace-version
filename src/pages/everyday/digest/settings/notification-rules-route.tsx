import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { EDITABLE_RULE_ID, NOTIFICATION_RULES } from "@/pages/everyday/digest/data";
import { EditNotificationRuleModal } from "@/pages/everyday/digest/settings/edit-rule-modal";
import { DigestSettingsTabs } from "@/pages/everyday/digest/settings/tabs";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** D12 — Notification rules. Own top-level footer route (/settings/notifications), a sibling of /settings/digest despite sharing its tab bar — see settings/tabs.tsx. */
const NotificationRulesRoute = () => {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Notification rules</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Eight rules · two are deliberately off · one was added after it cost four days</p>
        </div>
        <Button className="shrink-0">New rule</Button>
      </div>

      <DigestSettingsTabs active="notification-rules" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[960px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>When</th>
              <th className={HEAD_CLASS}>Who it reaches</th>
              <th className={HEAD_CLASS}>Channel</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Urgency</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Fired this week</th>
              <th className={cn(HEAD_CLASS, "text-right")}>State</th>
            </tr>
          </thead>
          <tbody>
            {NOTIFICATION_RULES.map((rule) => (
              <tr key={rule.id} className="border-b border-line last:border-0 hover:bg-paper-2">
                <td className="px-4 py-3.5">
                  {rule.id === EDITABLE_RULE_ID ? (
                    <button
                      type="button"
                      onClick={() => setEditingRuleId(rule.id)}
                      className="font-semibold text-ultra hover:underline"
                    >
                      {rule.when}
                    </button>
                  ) : (
                    <span className="font-semibold text-ink">{rule.when}</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-ink-3">{rule.whoItReaches}</td>
                <td className="px-4 py-3.5 text-ink-3 whitespace-nowrap">{rule.channel}</td>
                <td className={cn("px-4 py-3.5 text-right whitespace-nowrap", rule.urgencyTone ? TONE_TEXT_CLASS[rule.urgencyTone] : "text-ink-4")}>
                  {rule.urgency}
                </td>
                <td className={cn("px-4 py-3.5 text-right font-mono", rule.firedTone ? TONE_TEXT_CLASS[rule.firedTone] : "text-ink")}>
                  {rule.firedThisWeek}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Chip tone={rule.stateTone}>{rule.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="The fifth rule did not exist until 2 August, and its absence cost four days">
        An obligation could be accepted, dated and then silently missed, because nothing covered "passed its date".
        The renewal re-forecast went overdue on 9 August and notified nobody. It has fired three times this week,
        which is three things that would previously have gone unnoticed.
      </Callout>

      <Callout tone="amber" title="The last two have fired 440 times and reached nobody, correctly">
        412 agent runs and 28 scheduled sends. If those reached a person, the amber badge would stop meaning
        "somebody must act" inside a week. They are in the log, searchable, and permanently silent.
      </Callout>

      <EditNotificationRuleModal open={editingRuleId !== null} onOpenChange={(open) => !open && setEditingRuleId(null)} />
    </div>
  );
};

export default NotificationRulesRoute;
