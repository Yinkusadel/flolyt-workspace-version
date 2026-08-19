import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { TeamDot } from "@/pages/inbox/team-dot";
import { HandoffTabs } from "@/pages/handoff/handoff-tabs";
import { HandoffQuickLinks } from "@/pages/handoff/quick-links";
import { MY_OBLIGATIONS, OWED_TO_ME } from "@/pages/handoff/data";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H03 — `/handoff?owner=me`. */
export function OwedByMeState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What you owe</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Three obligations · one is four days overdue and ₦88M is being forecast on it
          </p>
        </div>
        <Button asChild>
          <Link to="/handoff/delivery-fee/o/renewal-reforecast">Re-date the overdue one</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <HandoffTabs active="owed-by-me" />
        <HandoffQuickLinks />
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[860px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>You owe</th>
              <th className={HEAD_CLASS}>To</th>
              <th className={HEAD_CLASS}>From</th>
              <th className={HEAD_CLASS}>Due</th>
              <th className={HEAD_CLASS}>State</th>
              <th className={HEAD_CLASS}>Blocks</th>
              <th className={HEAD_CLASS}>Accepted</th>
            </tr>
          </thead>
          <tbody>
            {MY_OBLIGATIONS.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  {row.id === "renewal-reforecast" ? (
                    <Link to={`/handoff/${row.chainId}/o/${row.id}`} className="text-ultra hover:underline">
                      {row.title}
                    </Link>
                  ) : (
                    <span className="text-ink-2">{row.title}</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <TeamDot team={row.toTeam} />
                </td>
                <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.fromChain}</td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.dueTone ? TONE_TEXT_CLASS[row.dueTone] : "text-ink-2")}>
                  {row.due}
                </td>
                <td className="px-4 py-3">
                  <Chip tone={row.stateTone}>{row.state}</Chip>
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.blocksTone ? TONE_TEXT_CLASS[row.blocksTone] : "text-ink-3")}>
                  {row.blocks}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.acceptedTone ? TONE_TEXT_CLASS[row.acceptedTone] : "text-ink-4")}>
                  {row.accepted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border-2 border-rose-border bg-rose-bg p-4">
        <p className="text-[12.5px] font-semibold text-ink">
          Everything downstream of the first row is currently wrong by about ₦88M
        </p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          Finance, the board pack and Ada's projection are all built on a repeat rate that has been known to be
          wrong since 2 August. None of them can see that they are, because a forecast does not show its own inputs.
        </p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          What you were owed in return
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Owed to you</th>
                <th className={HEAD_CLASS}>From</th>
                <th className={HEAD_CLASS}>Due</th>
                <th className={HEAD_CLASS}>State</th>
                <th className={HEAD_CLASS}>What it unblocks</th>
              </tr>
            </thead>
            <tbody>
              {OWED_TO_ME.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <TeamDot team={row.fromTeam} />
                  </td>
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.due}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone}>{row.state}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.unlocks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <p className="text-[12.5px] font-semibold text-ink">Three owed and two owing is roughly the workspace median</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          The distribution matters more than the count. Engineering holds 41 obligations and Finance holds 4 — which
          is visible on the{" "}
          <Link to="/handoff/load" className="font-semibold text-ultra hover:underline">
            load view
          </Link>{" "}
          and is the single largest structural bottleneck in this workspace.
        </p>
      </div>
    </div>
  );
}
