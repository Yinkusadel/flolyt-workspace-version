import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { TeamDot } from "@/pages/inbox/team-dot";
import { HandoffTabs } from "@/pages/handoff/handoff-tabs";
import { HandoffQuickLinks } from "@/pages/handoff/quick-links";
import { CHAIN_DETAILS, CHAIN_LIST } from "@/pages/handoff/data";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** H02 — the default populated `/handoff` view (no query params). */
export function IndexState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Handoffs</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Six chains · two live · two obligations overdue · one accepted by nobody
          </p>
        </div>
        <Button
          onClick={() =>
            toast.info("Handoffs aren't created here", {
              description: "They arrive when a room decides something that obliges another team. Open a room to decide something.",
            })
          }
        >
          New handoff
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <HandoffTabs active="every-chain" />
        <HandoffQuickLinks />
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Chain</th>
              <th className={HEAD_CLASS}>Started with</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Teams</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Obligations</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Overdue</th>
              <th className={HEAD_CLASS}>Oldest signal</th>
              <th className={HEAD_CLASS}>State</th>
            </tr>
          </thead>
          <tbody>
            {CHAIN_LIST.map((chain) => {
              const hasDetail = Boolean(CHAIN_DETAILS[chain.id]);
              return (
                <tr key={chain.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {hasDetail ? (
                      <Link to={`/handoff/${chain.id}`} className="text-ultra hover:underline">
                        {chain.title}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{chain.title}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <TeamDot team={chain.startedTeam} />
                    <span className="ml-1 text-ink-4">· {chain.startedDate}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-2">{chain.teamsCount}</td>
                  <td className="px-4 py-3 text-right text-ink-2">{chain.obligationsCount}</td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-semibold",
                      chain.overdueCount > 0 ? "text-rose" : "text-ink-4"
                    )}
                  >
                    {chain.overdueCount}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 whitespace-nowrap",
                      chain.oldestSignalTone ? TONE_TEXT_CLASS[chain.oldestSignalTone] : "text-ink-4"
                    )}
                  >
                    {chain.oldestSignal}
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={chain.statusTone}>{chain.statusLabel}</Chip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          What you owe, and what is owed to you
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-card border border-line bg-paper p-4">
            <p className="font-mono text-[9px] font-medium tracking-[0.8px] text-rose uppercase">Owed by you · 3</p>
            <h3 className="mt-1.5 text-[12.5px] font-semibold text-ink">One is four days overdue</h3>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              Re-forecast the August renewal book, due 9 August. It has been "not started" since the room closed and
              nothing chased it until the escalation rule was added on 2 August.
            </p>
            <Link
              to="/handoff/delivery-fee"
              className="mt-2.5 inline-block text-[10px] font-semibold text-rose hover:underline"
            >
              the delivery-fee chain
            </Link>
          </div>
          <div className="rounded-card border border-line bg-paper p-4">
            <p className="font-mono text-[9px] font-medium tracking-[0.8px] text-teal uppercase">Owed to you · 2</p>
            <h3 className="mt-1.5 text-[12.5px] font-semibold text-ink">Both on time</h3>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              Engineering is instrumenting checkout.fee_shown by the 14th, and Support has already reclassified
              "where is my order" as a revenue driver.
            </p>
            <span className="mt-2.5 inline-block text-[10px] font-semibold text-teal">1 shipped, 1 in progress</span>
          </div>
          <div className="rounded-card border border-line bg-paper p-4">
            <p className="font-mono text-[9px] font-medium tracking-[0.8px] text-amber uppercase">Unaccepted · 1</p>
            <h3 className="mt-1.5 text-[12.5px] font-semibold text-ink">Nobody has said yes to this</h3>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              "Hold every release against revenue for 14 days" was created on 2 August and routed to Engineering. It
              has been read four times and accepted zero.
            </p>
            <span className="mt-2.5 inline-block text-[10px] font-semibold text-amber">read ≠ accepted</span>
          </div>
        </div>
      </div>

      <Callout tone="teal" title="An index has to sit above a chain view">
        A single chain tells one story beautifully and is the right shape for explaining what went wrong once. It is
        the wrong shape for Monday morning, when the only question is which of these has slipped and who has to be
        told.
      </Callout>
    </div>
  );
}
