import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { ENGINEERING_LOAD_DETAIL, TEAM_LOAD } from "@/pages/handoff/data";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";

type LoadTab = "team" | "person";

/** H12 — `/handoff/load`. "By person" reuses H10's own "four of six sit with one person" copy rather than fabricating an org-wide per-person breakdown that isn't in the source. */
export default function LoadRoute() {
  const [tab, setTab] = useState<LoadTab>("team");

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Handoff", to: "/handoff" }, { label: "Who is the bottleneck" }]}
        title="Who is the bottleneck"
        subtitle="97 obligations across six chains · 41 land on one team · 11 are the same request"
        action={<Button onClick={() => toast.success("Escalated to Ada")}>Escalate to Ada</Button>}
      />

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => setTab("team")}
          className={cn(
            "shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap",
            tab === "team" ? "border border-line bg-paper font-semibold text-ink" : "font-normal text-ink-3 hover:text-ink-2"
          )}
        >
          By team
        </button>
        <button
          type="button"
          onClick={() => setTab("person")}
          className={cn(
            "shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap",
            tab === "person" ? "border border-line bg-paper font-semibold text-ink" : "font-normal text-ink-3 hover:text-ink-2"
          )}
        >
          By person
        </button>
        <Link to="/handoff?state=overdue" className="ml-1 shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap text-ink-3 hover:text-ink-2">
          Overdue · 9
        </Link>
        <span className="shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap text-ink-4">Unaccepted · 6</span>
      </div>

      {tab === "team" ? (
        <>
          <div>
            <p className="mb-3 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Who is being asked for what, across all six chains
            </p>
            <div className="space-y-4 rounded-card border border-line bg-paper p-4">
              {TEAM_LOAD.map((row) => (
                <WideBarRow
                  key={row.team}
                  label={`${row.team} · ${row.total} obligations`}
                  value={`${row.overdue} overdue · median ${row.median}`}
                  percent={row.percent}
                  tone={row.tone}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Engineering, in detail
            </p>
            <div className="overflow-x-auto rounded-card border border-line bg-paper">
              <table className="w-full min-w-[720px] text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-line bg-paper-2">
                    <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Owes</th>
                    <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">From</th>
                    <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Due</th>
                    <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Age</th>
                    <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Accepted</th>
                    <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {ENGINEERING_LOAD_DETAIL.map((row) => (
                    <tr key={row.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.fromChainId ? (
                          <Link to={`/handoff/${row.fromChainId}`} className="text-ultra hover:underline">
                            {row.fromChain}
                          </Link>
                        ) : (
                          <span className="text-ink-3">{row.fromChain}</span>
                        )}
                      </td>
                      <td className={cn("px-4 py-3 whitespace-nowrap", row.dueTone ? TONE_TEXT_CLASS[row.dueTone] : "text-ink-4")}>
                        {row.due}
                      </td>
                      <td className={cn("px-4 py-3 whitespace-nowrap", row.ageTone ? TONE_TEXT_CLASS[row.ageTone] : "text-ink-4")}>
                        {row.age}
                      </td>
                      <td className={cn("px-4 py-3 whitespace-nowrap", row.acceptedTone ? TONE_TEXT_CLASS[row.acceptedTone] : "text-ink-4")}>
                        {row.accepted}
                      </td>
                      <td className="px-4 py-3">
                        <Chip tone={row.clsTone}>{row.cls}</Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Callout tone="rose" title="Eleven of Engineering's fourteen overdue obligations are instrumentation">
            Every room that says "unavailable" is upstream of a request to Engineering that nobody prioritised. This
            is not a discipline problem in one team — it is the same class of request arriving eleven separate
            times from eleven separate rooms, with no aggregate owner and no shared queue.
          </Callout>
          <Callout tone="amber" title="One of the five is not an engineering task at all">
            "Hold every release against revenue for 14 days" is a release-process change that needs Ada. It has been
            sitting in Engineering's queue for 21 days looking like work, which is why it has never been accepted
            and never been disputed either.
          </Callout>
        </>
      ) : (
        <div>
          <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
            Four of six overdue sit with one person
          </p>
          <div className="divide-y divide-line rounded-card border border-line bg-paper">
            {[
              { label: "Sam Iyer holds", value: "4 of the 6 overdue · 41 obligations in total", tone: "rose" as const },
              { label: "Three of his four are instrumentation", value: "the same class of request, from four different rooms", tone: "amber" as const },
              { label: "Nobody has aggregated them", value: "each room chased its own, none saw the queue", tone: "rose" as const },
              { label: "What would help", value: "one prioritisation call above the teams, not four reminders", tone: "teal" as const },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="text-[11px] text-ink-3">{row.label}</span>
                <span className={cn("text-[10.5px] font-medium sm:text-right", TONE_TEXT_CLASS[row.tone])}>{row.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] text-ink-4">
            A full individual breakdown for every team isn't tracked yet — Sam's queue is the one the workspace has
            already surfaced as the standout.
          </p>
        </div>
      )}
    </div>
  );
}
