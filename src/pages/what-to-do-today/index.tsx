import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DEPARTMENT_COLORS } from "@/pages/lifecycle/data";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { ActorAvatar, PersonDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import {
  BEFORE_STANDUP,
  BELOW_LINE_SUMMARY,
  BELOW_THE_LINE,
  FILTER_URL_RULES,
  FIRST_LIST_ITEMS,
  GHANA_ROOM_OWNER_CANDIDATES,
  NOT_YOUR_LIST,
  ORG_STUCK,
  SAVED_VIEWS_TODAY,
  TEAM_ROSTER,
  TEAM_UNOWNED,
  TODAY_ITEMS,
  TODAY_TAB_COUNTS,
  WORKING_NOW,
  WORKSPACE_AGE_DAYS,
} from "@/pages/what-to-do-today/data";
import { AssignAnOwnerModal } from "@/pages/what-to-do-today/modals/assign-an-owner-modal";
import { SnoozeOrDismissModal } from "@/pages/what-to-do-today/modals/snooze-or-dismiss-modal";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

type ScopeTab = "mine" | "team" | "goal" | "org";

function ScopeTabs({ active }: { active: ScopeTab }) {
  const tabs: { key: ScopeTab; label: string; count: number; to: string }[] = [
    { key: "mine", label: "Mine", count: TODAY_TAB_COUNTS.mine, to: "/what-to-do-today" },
    { key: "team", label: "My team", count: TODAY_TAB_COUNTS.myTeam, to: "/what-to-do-today?scope=team" },
    { key: "goal", label: "Blocking a goal", count: TODAY_TAB_COUNTS.blockingGoal, to: "/what-to-do-today?filter=goal" },
    { key: "org", label: "Everything", count: TODAY_TAB_COUNTS.everything, to: "/what-to-do-today?scope=org" },
  ];
  return (
    <div className="-mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.to}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** T01 — the zero-items empty state. Unreachable via the current mock (TODAY_ITEMS is never empty), same as Rooms' R01. */
function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Nothing needs a decision from you · six agents working · two plays running</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/what-to-do-today?show=all">Show everything</Link>
        </Button>
      </div>

      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <h2 className="text-[16px] font-semibold text-ink">Nothing needs you today</h2>
        <p className="mx-auto mt-2.5 max-w-md text-[11.5px] leading-relaxed text-ink-3">
          Six agents are working across your fourteen rooms. Two plays are running and neither needs a decision.
          Nothing above ₦5M is unowned, and nothing is overdue.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline">See what agents are doing</Button>
          <Button asChild variant="outline">
            <Link to="/what-to-do-today?show=all">Show everything · 340</Link>
          </Button>
        </div>
        <p className="mt-4 text-[10px] text-ink-4">
          An empty list is the goal, not a bug. This screen is empty about two days a week.
        </p>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Working right now, and not asking you for anything
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>In</th>
                <th className={HEAD_CLASS}>Doing</th>
                <th className={HEAD_CLASS}>Since</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Will it reach you?</th>
              </tr>
            </thead>
            <tbody>
              {WORKING_NOW.map((row) => (
                <tr key={row.agent.initials} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ActorAvatar actor={{ kind: "agent", agent: row.agent }} size="sm" />
                      <span className="font-semibold text-ink-2">{row.agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.inWhat}</td>
                  <td className="px-4 py-3 text-ink-3">{row.doing}</td>
                  <td className="px-4 py-3 font-mono text-ink-4">{row.since}</td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right",
                      row.willReachTone ? TONE_TEXT_CLASS[row.willReachTone] : "text-ink-4"
                    )}
                  >
                    {row.willReach}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="Why this list can be empty while ₦566M is still at risk">
        Everything at risk is either being worked on by somebody, waiting on a date, or below the line. This screen
        is not a summary of open problems — it is a list of things that need a decision from you today. Those are
        different, and conflating them is how a daily list becomes a backlog nobody opens.
      </Callout>
    </div>
  );
}

/** T02 — the "day four" onboarding narrative, a distinct dataset from TODAY_ITEMS. Reached when WORKSPACE_AGE_DAYS <= 4. */
function FirstListState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Day four · three things, all decisions, all under two minutes</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/what-to-do-today/ranking">How this is ranked</Link>
        </Button>
      </div>

      <Callout tone="ultra" title="This list is an opinion, and here is how it was formed">
        Revenue at stake × confidence ÷ effort, then anything blocking one of your Q1 goals is lifted above anything
        that is not. Nothing moves up because it is old. Age is shown and never scored — a three-week-old ₦2M item
        stays below a fresh ₦200M one.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Your first three</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>#</th>
                <th className={HEAD_CLASS}>Do this</th>
                <th className={HEAD_CLASS}>Team</th>
                <th className={HEAD_CLASS}>Why it is here</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Effort</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Impact</th>
              </tr>
            </thead>
            <tbody>
              {FIRST_LIST_ITEMS.map((row) => (
                <tr key={row.rank} className="border-b border-line last:border-0 hover:bg-paper-2">
                  <td className="px-4 py-3.5 font-mono text-ink-4">{row.rank}</td>
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.title}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: DEPARTMENT_COLORS[row.department] }}
                      />
                      <span className="text-ink-2">{row.department}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.why}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono font-semibold",
                      row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink"
                    )}
                  >
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.effort}/5</td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.impact}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="All three of these take under two minutes and none of them are work">
        A first list is deliberately weighted toward decisions rather than projects — naming an owner, confirming a
        duplicate, approving something already proven elsewhere. The ₦412M item is on somebody else's list because
        somebody else owns it.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What is not on your list, and who has it
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Item</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={HEAD_CLASS}>Whose list it is on</th>
                <th className={HEAD_CLASS}>Why not yours</th>
              </tr>
            </thead>
            <tbody>
              {NOT_YOUR_LIST.map((row) => (
                <tr key={row.item} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 text-ink-2">{row.item}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono font-semibold",
                      row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink"
                    )}
                  >
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <PersonDot person={row.owner} size="sm" />
                      <span className="text-ink-2">{row.owner.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="neutral" title="The biggest number in the company is not on your list and that is correct">
        Flolyt does not show you everything that matters. It shows you what needs a decision from you. Everything
        above is visible under "Everything · 340" and none of it is hidden — it is just not yours today.
      </Callout>
    </div>
  );
}

function PinnedActionCell({ item }: { item: (typeof TODAY_ITEMS)[number] }) {
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [snoozeOpen, setSnoozeOpen] = React.useState(false);

  if (item.id === "ghana-signup-room") {
    return (
      <>
        <button
          type="button"
          onClick={() => setAssignOpen(true)}
          className="text-[10.5px] font-semibold text-ultra hover:underline"
        >
          Assign owner
        </button>
        <AssignAnOwnerModal
          open={assignOpen}
          onOpenChange={setAssignOpen}
          roomTitle="Ghana signups convert at 4%"
          roomMeta="Opened 03:40 on 10 August by Acquisition Quality · ₦31M · unowned 4 days"
          candidates={GHANA_ROOM_OWNER_CANDIDATES}
        />
      </>
    );
  }

  if (item.id === "growth-finance-conflict") {
    return (
      <>
        <button
          type="button"
          onClick={() => setSnoozeOpen(true)}
          className="text-[10.5px] font-semibold text-ultra hover:underline"
        >
          Snooze
        </button>
        <SnoozeOrDismissModal open={snoozeOpen} onOpenChange={setSnoozeOpen} />
      </>
    );
  }

  return null;
}

function RankedTable({ items }: { items: typeof TODAY_ITEMS }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[980px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-paper-2">
            <th className={HEAD_CLASS}>#</th>
            <th className={HEAD_CLASS}>Do this</th>
            <th className={HEAD_CLASS}>Team</th>
            <th className={HEAD_CLASS}>Why it is here</th>
            <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
            <th className={cn(HEAD_CLASS, "text-right")}>Effort</th>
            <th className={cn(HEAD_CLASS, "text-right")}>Impact</th>
            <th className={cn(HEAD_CLASS, "text-right")}>State</th>
            <th className={cn(HEAD_CLASS, "text-right")}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-line last:border-0 hover:bg-paper-2">
              <td className="px-4 py-3.5 font-mono text-ink-4">{item.rank}</td>
              <td className="px-4 py-3.5">
                <Link
                  to={`/what-to-do-today/${item.id}`}
                  className="font-semibold whitespace-nowrap text-ultra hover:underline"
                >
                  {item.title}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-ink-2 whitespace-nowrap">{item.department}</td>
              <td className="px-4 py-3.5 text-ink-3">{item.whyHere}</td>
              <td
                className={cn(
                  "px-4 py-3.5 text-right font-mono font-semibold whitespace-nowrap",
                  item.atStakeTone ? TONE_TEXT_CLASS[item.atStakeTone] : "text-ink"
                )}
              >
                {item.atStake}
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-ink-4">{item.effort}/5</td>
              <td className="px-4 py-3.5 text-right font-mono text-ink-4">{item.impact}/5</td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                <Chip tone={item.stateTone}>{item.stateLabel}</Chip>
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                <PinnedActionCell item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** T03 — the default steady-state ranked list ("Mine" scope, no query params). */
function RankedListState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Yours first · ranked by revenue at stake against your Q1 goals, not by when it was found
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/what-to-do-today/ranking">How this is ranked</Link>
        </Button>
      </div>

      <ScopeTabs active="mine" />

      <RankedTable items={TODAY_ITEMS} />

      <Callout tone="amber" title="Item four is worth less than item one and is pinned above nothing">
        An overdue obligation is never allowed below the line, but it does not jump the queue either. A broken
        commitment is a different kind of thing from an open opportunity — it is pinned into the list, ranked
        honestly inside it, and marked so you can see why it survived a cut it would otherwise have failed.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Below the line · nothing is hidden
        </p>
        <div className="mt-2 grid grid-cols-1 gap-y-2 rounded-card border border-line bg-paper p-4 text-[11.5px] sm:grid-cols-2">
          {BELOW_LINE_SUMMARY.map((row) => (
            <React.Fragment key={row.label}>
              <p className="text-ink-2">{row.label}</p>
              <p className={cn("text-right font-mono", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink-4")}>
                {row.value}
              </p>
            </React.Fragment>
          ))}
        </div>
        <Link
          to="/what-to-do-today?show=all"
          className="mt-2 inline-block text-[11px] font-semibold text-ultra hover:underline"
        >
          Show everything below the line →
        </Link>
      </div>
    </div>
  );
}

/** T05 — the below-the-line expanded view, reached via ?show=all. */
function BelowLineState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today · everything</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Four ranked, six that cannot be ranked yet, and the reason for each
          </p>
        </div>
        <Button variant="outline" className="shrink-0">
          Quick wins only
        </Button>
      </div>

      <ScopeTabs active="mine" />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Ranked · above the line</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[560px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>#</th>
                <th className={HEAD_CLASS}>Do this</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>State</th>
              </tr>
            </thead>
            <tbody>
              {TODAY_ITEMS.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0 hover:bg-paper-2">
                  <td className="px-4 py-3 font-mono text-ink-4">{item.rank}</td>
                  <td className="px-4 py-3">
                    <Link to={`/what-to-do-today/${item.id}`} className="font-semibold text-ultra hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-mono font-semibold",
                      item.atStakeTone ? TONE_TEXT_CLASS[item.atStakeTone] : "text-ink"
                    )}
                  >
                    {item.atStake}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={item.stateTone}>{item.stateLabel}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Below the line · why each one is here rather than up there
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Item</th>
                <th className={HEAD_CLASS}>Reason it is not ranked</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Would rank when</th>
              </tr>
            </thead>
            <tbody>
              {BELOW_THE_LINE.map((row) => (
                <tr key={row.item} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 text-ink-2">{row.item}</td>
                  <td className="px-4 py-3.5 text-ink-3">{row.reason}</td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right font-mono",
                      row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink"
                    )}
                  >
                    {row.atStake}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-right",
                      row.wouldRankWhenTone ? TONE_TEXT_CLASS[row.wouldRankWhenTone] : "text-ink-4"
                    )}
                  >
                    {row.wouldRankWhen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="rose" title="The last row is the uncomfortable one">
        ₦74M sits behind an idea that has been suggested twice by an agent, deferred twice, and never became an
        open item. It is not below the line because it is small — it is below the line because nothing in the
        product turns a deferred suggestion into something that gets ranked. That is a real gap and it is shown
        rather than absorbed.
      </Callout>

      <Callout tone="neutral" title="Two things become rankable the moment a source connects">
        Both name the exact source. A blocked item with a named unblocker is a task; a blocked item without one is
        a mystery, and this screen refuses to produce mysteries.
      </Callout>
    </div>
  );
}

/** T10 — scoped to the viewer's team, reached via ?scope=team. */
function TeamScopeState() {
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

/** T11 — org-wide "where is the org stuck" exec view, reached via ?scope=org. */
function OrgScopeState() {
  const stats: Kpi[] = [
    { eyebrow: "Teams behind pace", value: "14 of 118", tone: "amber", note: "up from 11 last week" },
    { eyebrow: "Revenue at risk, open", value: "₦1.31B", tone: "rose", note: "across four markets" },
    { eyebrow: "Waiting on you", value: "6", tone: "rose", note: "₦1.4B behind them" },
    { eyebrow: "Unowned across the org", value: "19 rooms", tone: "rose", note: "₦96M" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Where the org is stuck</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">118 teams · four of these need Ada and two do not</p>
        </div>
        <Button className="shrink-0">Grant a standing authority</Button>
      </div>

      <ScopeTabs active="org" />

      <KpiCards items={stats} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What is stuck, rather than what is happening
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What is stuck</th>
                <th className={HEAD_CLASS}>Where</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Behind it</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Stuck for</th>
                <th className={HEAD_CLASS}>Needs</th>
                <th className={cn(HEAD_CLASS, "text-right")}>You?</th>
              </tr>
            </thead>
            <tbody>
              {ORG_STUCK.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.what}</td>
                  <td className="px-4 py-3.5 text-ink-3 whitespace-nowrap">{row.where}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.behindTone ? TONE_TEXT_CLASS[row.behindTone] : "text-ink")}>
                    {row.behind}
                  </td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.stuckForTone ? TONE_TEXT_CLASS[row.stuckForTone] : "text-ink-4")}>
                    {row.stuckFor}
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.needs}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Chip tone={row.needsYou ? "rose" : "neutral"}>{row.needsYou ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title="An exec list is a list of blockages, not a summary of activity">
        Ada owns nothing directly, so her personal list is nearly empty — which is exactly backwards for the person
        with the widest span. This scope answers one question: what is stuck that only I can unstick. Two of the
        six above are explicitly marked as not hers, so the list stays honest rather than flattering.
      </Callout>

      <Callout tone="rose" title="The cheapest item here has been available since 12 January">
        Assigning owners to Advocate and Churn takes two names and no budget. Between them those stages have 36
        agent findings, zero rooms, and nine breached thresholds routing to an empty field.
      </Callout>
    </div>
  );
}

/** T12 — filters + saved views applied, reached via any of ?effort=, ?owner=, ?filter=, ?view=. */
function FiltersState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What to do today</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Filtered to "before standup" · three items, six minutes, all under two minutes each
          </p>
        </div>
        <Button className="shrink-0">Save this view</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[200px] flex-1 items-center rounded-control border-2 border-line bg-paper px-3.5 py-2">
          <span className="text-[11.5px] text-ink-4">Search your list</span>
        </div>
        <Chip tone="ultra" className="cursor-default">
          Quick wins
        </Chip>
        <Chip tone="neutral" className="cursor-default">
          Above ₦25M
        </Chip>
        <Chip tone="neutral" className="cursor-default">
          Overdue
        </Chip>
        <Chip tone="ultra" className="cursor-default">
          No owner
        </Chip>
        <Chip tone="neutral" className="cursor-default">
          + Filter
        </Chip>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Saved views</p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SAVED_VIEWS_TODAY.map((view) => (
            <button
              key={view.label}
              type="button"
              className={cn(
                "rounded-card border p-3.5 text-left",
                view.active ? "border-2 border-ultra-border bg-paper" : "border-line bg-paper"
              )}
            >
              <p className="text-[11.5px] font-semibold text-ink">{view.label}</p>
              <p className="mt-1 font-mono text-[10px] text-ink-4">{view.note}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Before standup · three items, six minutes total
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>#</th>
                <th className={HEAD_CLASS}>Do this</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Effort</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Time</th>
                <th className={HEAD_CLASS}>What it unblocks</th>
              </tr>
            </thead>
            <tbody>
              {BEFORE_STANDUP.map((row) => (
                <tr key={row.rank} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-mono text-ink-4">{row.rank}</td>
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.title}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink")}>
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-ink-4">{row.effort}/5</td>
                  <td className="px-4 py-3.5 text-right font-mono text-teal">{row.time}</td>
                  <td className="px-4 py-3.5 text-ink-3">{row.unblocks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="teal" title='"Quick wins" is a filter on effort, not a lower standard'>
        Every item here still had to earn its place on revenue at stake and confidence. The filter removes the
        ones that need an hour, not the ones that need thought — and it exists because a list you cannot start is
        a list you stop opening.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Every filter is in the URL</p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {FILTER_URL_RULES.map((rule) => (
            <div
              key={rule.label}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
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
}

/** T01-T03, T05, T10-T12 — all share the /what-to-do-today route, branching on data shape and query params. */
const WhatToDoToday = () => {
  const [searchParams] = useSearchParams();
  const scope = searchParams.get("scope");
  const showAll = searchParams.get("show") === "all";
  const hasFilter = searchParams.has("effort") || searchParams.has("owner") || searchParams.has("view") || searchParams.get("filter") === "quick-wins";

  if (scope === "team") return <TeamScopeState />;
  if (scope === "org") return <OrgScopeState />;
  if (hasFilter) return <FiltersState />;
  if (showAll) return <BelowLineState />;

  if (TODAY_ITEMS.length === 0) return <EmptyState />;
  if (WORKSPACE_AGE_DAYS <= 4) return <FirstListState />;
  return <RankedListState />;
};

export default WhatToDoToday;
