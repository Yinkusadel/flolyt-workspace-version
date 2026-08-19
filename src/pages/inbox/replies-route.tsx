import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { AgentDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { Chip } from "@/pages/lifecycle/stage/chip";
import {
  REPLIES_CLOSING_CALLOUT,
  REPLIES_TABS,
  REPLY_REASON_CARDS,
  REPLY_ROWS,
} from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CARD_TONE_CLASS = {
  ultra: "border-ultra-border bg-ultra-bg",
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
  rose: "border-rose-border bg-rose-bg",
  neutral: "border-line bg-paper-2",
} as const;

/** I05 — Replies, /inbox/replies. */
const RepliesRoute = () => {
  const [searchParams] = useSearchParams();
  const active = searchParams.get("tab") ?? "needs-human";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Replies</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Five need a human · 1,904 answered themselves · two changed a decision doc
        </p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto">
        {REPLIES_TABS.map((tab) => (
          <Link
            key={tab.key}
            to={tab.key === "needs-human" ? "/inbox/replies" : `/inbox/replies?tab=${tab.key}`}
            className={cn(
              "shrink-0 rounded-panel px-3 py-1.5 text-[11px] whitespace-nowrap",
              active === tab.key
                ? "border border-line bg-paper font-semibold text-ink"
                : "font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label} · {tab.count.toLocaleString()}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[880px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Customer</th>
              <th className={HEAD_CLASS}>Replied to</th>
              <th className={HEAD_CLASS}>What they said</th>
              <th className={HEAD_CLASS}>Why it is here</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Waiting</th>
              <th className={cn(HEAD_CLASS, "text-right")}>SLA</th>
            </tr>
          </thead>
          <tbody>
            {REPLY_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0 hover:bg-paper-2">
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link to={`/inbox/replies/${row.id}`} className="font-semibold text-ultra hover:underline">
                    {row.customer.name} · {row.customer.location}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.repliedTo}</td>
                <td className="px-4 py-3 text-ink-2">{row.quote}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.reasonTone}>{row.reason}</Chip>
                </td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.waitingTone ? TONE_TEXT_CLASS[row.waitingTone] : "text-ink-4")}>
                  {row.waiting}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.slaTone ? TONE_TEXT_CLASS[row.slaTone] : "text-ink-4")}>
                  {row.sla}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Why these five and not the other 1,904
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {REPLY_REASON_CARDS.map((card) => (
            <div key={card.label} className={cn("flex flex-col justify-between rounded-card border p-4", CARD_TONE_CLASS[card.tone])}>
              <div>
                <span className={cn("flex items-center gap-1.5 font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase", TONE_TEXT_CLASS[card.tone])}>
                  {card.agent && <AgentDot agent={card.agent} size="sm" />}
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
        <h3 className="text-[13px] font-semibold text-ink">{REPLIES_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{REPLIES_CLOSING_CALLOUT.body}</p>
      </div>
    </div>
  );
};

export default RepliesRoute;
