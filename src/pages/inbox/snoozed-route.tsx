import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { KvList } from "@/pages/digest/kv-list";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { InboxTabs } from "@/pages/inbox/quick-links";
import { SNOOZED_CALLOUT, SNOOZED_ROWS, SNOOZE_RULES } from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** I09 — Snoozed, /inbox/snoozed. */
const SnoozedRoute = () => {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Inbox", to: "/inbox" }, { label: "Snoozed" }]}
        title="Snoozed"
        subtitle="Five items · one snoozed twice and escalated · ₦31M sitting behind it"
      />

      <InboxTabs />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[960px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Item</th>
              <th className={HEAD_CLASS}>Snoozed because</th>
              <th className={HEAD_CLASS}>Snoozed</th>
              <th className={HEAD_CLASS}>Returns</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Cost of waiting</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Times</th>
              <th className={HEAD_CLASS}>Who knows</th>
            </tr>
          </thead>
          <tbody>
            {SNOOZED_ROWS.map((row) => (
              <tr key={row.item} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.item}</td>
                <td className="px-4 py-3 text-ink-3">{row.because}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-4">{row.snoozedWhen}</td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.returnsTone ? TONE_TEXT_CLASS[row.returnsTone] : "text-ink-2")}>
                  {row.returns}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.costOfWaitingTone ? TONE_TEXT_CLASS[row.costOfWaitingTone] : "text-ink-4")}>
                  {row.costOfWaiting}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono", row.timesTone ? TONE_TEXT_CLASS[row.timesTone] : "text-ink-4")}>
                  {row.times}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.whoKnowsTone ? TONE_TEXT_CLASS[row.whoKnowsTone] : "text-ink-3")}>
                  {row.whoKnows}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{SNOOZED_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{SNOOZED_CALLOUT.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The rules</p>
        <KvList rows={SNOOZE_RULES} />
      </div>
    </div>
  );
};

export default SnoozedRoute;
