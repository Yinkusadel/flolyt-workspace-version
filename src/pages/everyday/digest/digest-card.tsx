import { cn } from "@/lib/utils";
import { AgentDot } from "@/pages/everyday/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import type { DigestCard as DigestCardData } from "@/pages/everyday/digest/types";

/**
 * The eyebrow(+agent avatar) / title / body / divider / mono-footer card
 * repeated across D01–D03, D07, D15, D16 — the dominant primitive in this
 * section. No left/top accent strand per the app's card convention, even
 * though the source SVGs draw one on every card.
 */
export function DigestCard({ eyebrow, eyebrowTone, agent, title, body, footnote, footnoteTone, muted }: DigestCardData) {
  return (
    <div className={cn("rounded-card border border-line p-4", muted ? "bg-paper-2" : "bg-paper")}>
      <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase">
        {agent && <AgentDot agent={agent} size="sm" />}
        <span className={muted ? "text-ink-4" : TONE_TEXT_CLASS[eyebrowTone]}>{eyebrow}</span>
      </span>
      <h3 className="mt-2 text-[13px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{body}</p>
      {footnote && (
        <p
          className={cn(
            "mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px]",
            footnoteTone ? TONE_TEXT_CLASS[footnoteTone] : "text-ink-3"
          )}
        >
          {footnote}
        </p>
      )}
    </div>
  );
}
