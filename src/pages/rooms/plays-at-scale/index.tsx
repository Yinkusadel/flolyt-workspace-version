import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { ActorAvatar } from "@/pages/rooms/actor";
import { EXPANSION, IFEOMA, INVOLUNTARY_CHURN, PRICE_MARGIN, RAVI, REPEAT_DECAY, TUNDE } from "@/pages/rooms/data";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { PersonRef, Tone } from "@/pages/rooms/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

type Tab = "needs-approval" | "running" | "done" | "rejected";

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: "needs-approval", label: "Needs approval", count: 14 },
  { key: "running", label: "Running", count: 31 },
  { key: "done", label: "Done", count: 312 },
  { key: "rejected", label: "Rejected", count: 38 },
];

const ROWS: {
  play: string;
  room: string;
  roomId: string;
  proposedBy: typeof REPEAT_DECAY;
  affects: string;
  affectsTone?: Tone;
  waiting: string;
  waitingTone: Tone;
  who: PersonRef;
  effect: string;
  effectTone: Tone;
}[] = [
  { play: "Reactivate 100,000 in three waves", room: "Second order never happened", roomId: "second-order-never-happened", proposedBy: REPEAT_DECAY, affects: "100,000", waiting: "19 hrs", waitingTone: "rose", who: IFEOMA, effect: "₦258M", effectTone: "rose" },
  { play: "Retry cards at payday +1", room: "Cards failing on renewal night", roomId: "cards-failing-on-renewal-night", proposedBy: INVOLUNTARY_CHURN, affects: "61,400", waiting: "4 hrs", waitingTone: "amber", who: RAVI, effect: "₦88M", effectTone: "amber" },
  { play: "Stop the 20% code for full-price buyers", room: "Discount-only buyers", roomId: "discount-only-buyers", proposedBy: PRICE_MARGIN, affects: "94,000", waiting: "2 days", waitingTone: "rose", who: TUNDE, effect: "₦46M", effectTone: "amber" },
  { play: "Prompt 94,000 toward a higher plan", room: "Pay as you go past break-even", roomId: "pay-as-you-go-past-break-even", proposedBy: EXPANSION, affects: "94,000", waiting: "6 hrs", waitingTone: "amber", who: TUNDE, effect: "₦31M", effectTone: "amber" },
  { play: "Reprice Ghana to match Nigeria", room: "Ghana price drift", roomId: "ghana-price-drift", proposedBy: PRICE_MARGIN, affects: "410,000", affectsTone: "rose", waiting: "3 days", waitingTone: "rose", who: RAVI, effect: "GHS 2.1M", effectTone: "amber" },
];

const STATS: Kpi[] = [
  { eyebrow: "Waiting on a person", value: "14 plays", tone: "rose", note: "₦1.4B behind them" },
  { eyebrow: "Oldest", value: "3 days", tone: "rose", note: "Ghana repricing" },
  { eyebrow: "Waiting on one person alone", value: "6", tone: "rose", note: "everything over 100,000" },
  { eyebrow: "Median time to decide", value: "3.1 hrs", tone: "teal", note: "was 2 days in January" },
];

/** R41 — Plays at scale (`/plays`) — a top-level cross-room approval queue. */
const PlaysAtScale = () => {
  const [tab, setTab] = React.useState<Tab>("needs-approval");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Plays</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Every play across every open room · fourteen are waiting on a person · six on the same person
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              tab === t.key ? "border-ink font-semibold text-ink" : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {t.label} · {t.count}
          </button>
        ))}
      </div>

      {tab === "needs-approval" && (
        <>
          <div className="overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[920px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className={HEAD_CLASS}>Play</th>
                  <th className={HEAD_CLASS}>Room</th>
                  <th className={HEAD_CLASS}>Proposed by</th>
                  <th className={HEAD_CLASS}>Affects</th>
                  <th className={HEAD_CLASS}>Waiting</th>
                  <th className={HEAD_CLASS}>Who decides</th>
                  <th className={cn(HEAD_CLASS, "text-right")}>Effect if approved</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.play} className="border-b border-line last:border-0 hover:bg-paper-2">
                    <td className="px-4 py-3">
                      <Link to={`/rooms/${row.roomId}/plays`} className="font-semibold text-ink-2 hover:text-ink">
                        {row.play}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/rooms/${row.roomId}`} className="text-ink-3 hover:text-ink-2">
                        {row.room}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <ActorAvatar actor={{ kind: "agent", agent: row.proposedBy }} size="sm" />
                    </td>
                    <td className={cn("px-4 py-3 font-mono", row.affectsTone ? TONE_TEXT_CLASS[row.affectsTone] : "text-ink")}>
                      {row.affects}
                    </td>
                    <td className={cn("px-4 py-3 font-mono", TONE_TEXT_CLASS[row.waitingTone])}>{row.waiting}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <ActorAvatar actor={{ kind: "human", person: row.who }} size="sm" />
                        <span className="text-ink-2">{row.who.name.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className={cn("px-4 py-3 text-right font-mono", TONE_TEXT_CLASS[row.effectTone])}>{row.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">What the queue costs</p>
          <KpiCards items={STATS} />

          <div className="rounded-card border border-amber-border bg-amber-bg p-4">
            <div>
              <p className="text-[12px] font-semibold text-ink">
                This screen exists so a queue cannot form quietly, and it is deliberately not a place to approve things
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
                Every row here is one person away from happening. Clicking a row takes you into the room, where the
                evidence is, and the decision is made there under your identity. Six of the fourteen are waiting on
                one person — which is an argument for standing authority, not for a bulk button.
              </p>
            </div>
          </div>
        </>
      )}

      {tab !== "needs-approval" && (
        <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="text-[12px] font-semibold text-ink">
            {TABS.find((t) => t.key === tab)?.count} plays in this state
          </p>
          <p className="mt-1.5 text-[11px] text-ink-3">Not built out beyond the queue's own reference view.</p>
        </div>
      )}
    </div>
  );
};

export default PlaysAtScale;
