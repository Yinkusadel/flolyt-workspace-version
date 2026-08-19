import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { InboxSettingsLink, InboxTabs } from "@/pages/inbox/quick-links";
import { GROUPED_CLOSING_CALLOUT, GROUPED_ROWS, GROUP_CARDS, GROUP_FILTER_TABS } from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** I03 — Grouped triage, /inbox?group=cost (and the other ?group= values, which share this same view). */
export function GroupedTriageState({ activeGroup }: { activeGroup: string }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Your inbox</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Eleven decisions · grouped by what one more day of waiting costs
          </p>
        </div>
        <InboxSettingsLink />
      </div>

      <InboxTabs />

      <div className="flex items-center gap-1 overflow-x-auto">
        {GROUP_FILTER_TABS.map((tab) => (
          <Link
            key={tab.key}
            to={`/inbox?group=${tab.key}`}
            className={cn(
              "shrink-0 rounded-panel px-3 py-1.5 text-[11px] whitespace-nowrap",
              activeGroup === tab.key
                ? "border border-line bg-paper font-semibold text-ink"
                : "font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Eleven decisions · grouped by the cost of one more day, not by arrival time
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Decision</th>
                <th className={HEAD_CLASS}>Room</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Cost per day</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Waiting</th>
                <th className={HEAD_CLASS}>Effort to decide</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Group</th>
              </tr>
            </thead>
            <tbody>
              {GROUPED_ROWS.map((row) => (
                <tr key={row.decision} className="border-b border-line last:border-0 hover:bg-paper-2">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.decision}</td>
                  <td className="px-4 py-3 text-ink-3">{row.room}</td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.costPerDayTone ? TONE_TEXT_CLASS[row.costPerDayTone] : "text-ink-4")}>
                    {row.costPerDay}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.waitingTone ? TONE_TEXT_CLASS[row.waitingTone] : "text-ink-4")}>
                    {row.waiting}
                  </td>
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.effort}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.groupTone} className="ml-auto">
                      {row.groupLabel}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Three groups, and what each one is for
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {GROUP_CARDS.map((card) => (
            <div key={card.key} className={cn("flex flex-col justify-between rounded-card border p-4", TONE_BG_CLASS[card.tone])}>
              <div>
                <span className={cn("font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase", TONE_TEXT_CLASS[card.tone])}>
                  {card.label}
                </span>
                <h3 className="mt-2 text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
              </div>
              <p className={cn("mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] font-semibold", TONE_TEXT_CLASS[card.tone])}>
                {card.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{GROUPED_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{GROUPED_CLOSING_CALLOUT.body}</p>
      </div>
    </div>
  );
}

const TONE_BG_CLASS = {
  ultra: "border-ultra-border bg-paper",
  rose: "border-rose-border bg-paper",
  amber: "border-amber-border bg-paper",
  teal: "border-teal-border bg-paper",
  neutral: "border-line bg-paper",
} as const;
