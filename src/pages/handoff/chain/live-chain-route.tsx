import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { ChainTabs } from "@/pages/handoff/chain/chain-tabs";
import { useChainContext } from "@/pages/handoff/chain/chain-layout";
import { TeamDot } from "@/pages/inbox/team-dot";
import { TONE_TEXT_CLASS, TONE_BG_CLASS } from "@/pages/rooms/tone";

/** H04 — `/handoff/:id`, for a live chain (currently only "delivery-fee"). */
export default function LiveChainRoute() {
  const { chain } = useChainContext();
  const signals = chain.signals ?? [];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Handoff", to: "/handoff" }, { label: chain.title }]}
        title="One cause, five teams"
        subtitle={chain.subtitle}
        action={<Button onClick={() => toast.success("Chain link copied")}>Share this chain</Button>}
      />

      <ChainTabs chainId={chain.id} active="chain" />

      <div>
        <p className="mb-3 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
          The chain, in order · 4 March to 2 August
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {signals.map((signal, i) => (
            <div key={i} className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-4">
              <span className="w-14 shrink-0 font-mono text-[10.5px] text-ink-4">{signal.date}</span>
              <div className="w-32 shrink-0">
                {signal.team === "Everyone" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 shrink-0 rounded-full bg-ink-4" aria-hidden />
                    <span className="text-ink-2">Everyone</span>
                  </span>
                ) : (
                  <TeamDot team={signal.team} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-ink">{signal.headline}</p>
                <p className="mt-0.5 text-[10.5px] text-ink-3">{signal.detail}</p>
              </div>
              {signal.tag && (
                <span
                  className={cn(
                    "shrink-0 self-start rounded-chip border px-2 py-0.5 text-[9.5px] font-semibold whitespace-nowrap",
                    signal.tagTone ? TONE_BG_CLASS[signal.tagTone] : "border-line bg-paper-2",
                    signal.tagTone ? TONE_TEXT_CLASS[signal.tagTone] : "text-ink-3"
                  )}
                >
                  {signal.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {(chain.liveInsights ?? []).map((insight, i) => (
          <div key={i} className={cn("rounded-card border p-4", TONE_BG_CLASS[insight.tone])}>
            <p className="text-[12.5px] font-semibold text-ink">{insight.title}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{insight.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
