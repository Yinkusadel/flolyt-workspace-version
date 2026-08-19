import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { ScopeTabs } from "@/pages/everyday/what-to-do-today/scope-tabs";
import { TEAM_ROSTER, TEAM_UNOWNED } from "@/pages/everyday/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T10 — scoped to the viewer's team, reached via ?scope=team. */
export function TeamScopeState() {
  const stats: Kpi[] = [
    { eyebrow: "Your team", value: "9 people", note: "East Africa CS" },
    { eyebrow: "Open items", value: "17", tone: "amber", note: "₦218M at stake" },
    { eyebrow: "Nobody on them", value: "3", tone: "rose", note: "unassigned 4+ days" },
    { eyebrow: "Overloaded", value: "2 people", tone: "amber", note: "Grace and Peter" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What your team should do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">East Africa CS · nine people · 17 open · three have nobody on them</p>
        </div>
        <Button className="shrink-0">Assign the three</Button>
      </div>

      <ScopeTabs active="team" />

      <KpiCards items={stats} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Who is carrying what</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Person</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Items</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Oldest</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Approvals waiting</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Rooms watched</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Load</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_ROSTER.map((row) => (
                <tr key={row.person?.initials ?? "unassigned"} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    {row.person ? (
                      <div className="flex items-center gap-1.5">
                        <PersonDot person={row.person} size="sm" />
                        <span className="font-semibold text-ink-2">{row.person.name}</span>
                      </div>
                    ) : (
                      <Chip tone="amber">Nobody</Chip>
                    )}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.itemsTone ? TONE_TEXT_CLASS[row.itemsTone] : "text-ink")}>
                    {row.items}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink")}>
                    {row.atStake}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.oldestTone ? TONE_TEXT_CLASS[row.oldestTone] : "text-ink-4")}>
                    {row.oldest}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.approvalsWaitingTone ? TONE_TEXT_CLASS[row.approvalsWaitingTone] : "text-ink-4")}>
                    {row.approvalsWaiting}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.roomsWatchedTone ? TONE_TEXT_CLASS[row.roomsWatchedTone] : "text-ink-4")}>
                    {row.roomsWatched ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.badgeTone}>{row.badge}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The three with nobody on them
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Do this</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Opened</th>
                <th className={HEAD_CLASS}>Suggested owner</th>
                <th className={HEAD_CLASS}>Why them</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_UNOWNED.map((row) => (
                <tr key={row.title} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.title}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink")}>
                    {row.atStake}
                  </td>
                  <td className={cn("px-4 py-3.5 text-right font-mono", row.openedTone ? TONE_TEXT_CLASS[row.openedTone] : "text-ink-4")}>
                    {row.opened}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <PersonDot person={row.suggestedOwner} size="sm" />
                      <span className="text-ink-2">{row.suggestedOwner.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title='Between "mine" and "everything" is where a team lead actually lives'>
        Kunle has nine people and no interest in the other 117 teams. This answers the two questions he has every
        morning — is anything unowned, and is anyone drowning — neither of which the personal list or the company
        list can answer. Load counts watched rooms as well as open items, because attention is the thing that runs
        out first.
      </Callout>
    </div>
  );
}
