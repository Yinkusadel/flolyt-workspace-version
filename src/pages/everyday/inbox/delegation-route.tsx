import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { InboxTabs } from "@/pages/everyday/inbox/quick-links";
import { DELEGATION_BANNER, DELEGATION_CARDS, DELEGATION_CLOSING_CALLOUT, DELEGATION_ROWS } from "@/pages/everyday/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CARD_TONE_CLASS = {
  ultra: "border-ultra-border bg-ultra-bg",
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
  rose: "border-rose-border bg-rose-bg",
  neutral: "border-line bg-paper-2",
} as const;

/** I10 — Delegate while away, /inbox/delegation. */
const DelegationRoute = () => {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Inbox", to: "/inbox" }, { label: "Delegation" }]}
        title="While you are away"
        subtitle="15–22 August · nine things would wait · ₦186M behind them"
        action={<Button onClick={() => toast.success("Cover creation isn't wired up in this preview")}>Set the cover</Button>}
      />

      <InboxTabs />

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{DELEGATION_BANNER.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{DELEGATION_BANNER.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What would wait for you
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>From</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At risk</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Would wait</th>
                <th className={HEAD_CLASS}>Cover</th>
                <th className={HEAD_CLASS}>Why them</th>
              </tr>
            </thead>
            <tbody>
              {DELEGATION_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-ink-3">{row.from}</td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.atRiskTone ? TONE_TEXT_CLASS[row.atRiskTone] : "text-ink-4")}>
                    {row.atRisk}
                  </td>
                  <td className={cn("px-4 py-3 text-right whitespace-nowrap", row.wouldWaitTone ? TONE_TEXT_CLASS[row.wouldWaitTone] : "text-ink-3")}>
                    {row.wouldWait}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.cover ? (
                      <span className="flex items-center gap-2 font-semibold text-ink-2">
                        <PersonDot person={row.cover} size="sm" />
                        {row.cover.name}
                      </span>
                    ) : (
                      <Chip tone={row.coverTone}>{row.coverLabel}</Chip>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What a cover can and cannot do
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {DELEGATION_CARDS.map((card) => (
            <div key={card.label} className={cn("flex flex-col justify-between rounded-card border p-4", CARD_TONE_CLASS[card.tone])}>
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

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{DELEGATION_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{DELEGATION_CLOSING_CALLOUT.body}</p>
      </div>
    </div>
  );
};

export default DelegationRoute;
