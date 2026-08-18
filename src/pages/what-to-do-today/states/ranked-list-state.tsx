import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { ScopeTabs } from "@/pages/what-to-do-today/scope-tabs";
import { BELOW_LINE_SUMMARY, GHANA_ROOM_OWNER_CANDIDATES, TODAY_ITEMS } from "@/pages/what-to-do-today/data";
import { AssignAnOwnerModal } from "@/pages/what-to-do-today/modals/assign-an-owner-modal";
import { SnoozeOrDismissModal } from "@/pages/what-to-do-today/modals/snooze-or-dismiss-modal";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

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
export function RankedListState() {
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
