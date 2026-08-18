import { cn } from "@/lib/utils";
import { ActorAvatar } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { AgentRef, Tone } from "@/pages/rooms/types";

export type ThreeCard = { eyebrow: string; agent?: AgentRef; heading: string; body: string; footer: string; tone: Tone };

/** The 3-up card layout reused by R17 (disagreement), R20 (if-works/if-fails/cannot-undo), R24 (resolve options). */
export function ThreeCardRow({ cards }: { cards: ThreeCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.eyebrow} className="flex flex-col rounded-card border border-line bg-paper p-4">
          <div className="flex items-center gap-1.5">
            {card.agent && <ActorAvatar actor={{ kind: "agent", agent: card.agent }} size="sm" />}
            <p className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">{card.eyebrow}</p>
          </div>
          <p className="mt-1.5 text-[13px] font-semibold text-ink">{card.heading}</p>
          <p className="mt-1.5 flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
          <p className={cn("mt-2.5 border-t border-dashed border-line pt-2 font-mono text-[10px] font-semibold", TONE_TEXT_CLASS[card.tone])}>
            {card.footer}
          </p>
        </div>
      ))}
    </div>
  );
}
