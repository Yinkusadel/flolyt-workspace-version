import { PersonAvatar } from "@/components/person-avatar";
import type { InsightCard } from "@/pages/lifecycle/stage/activate/data";

const ACCENT_CLASS: Record<InsightCard["tone"], string> = { teal: "bg-teal", amber: "bg-amber", rose: "bg-rose" };
const FOOTNOTE_CLASS: Record<InsightCard["tone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

/**
 * The 3-card "agent note + counter-argument + untried option" pattern seen
 * on Activate's Paths (AC04) and Cohorts (AC06) tabs — same visual shape as
 * Acquire's funnel action cards, reused here across both of Activate's tabs.
 */
export function InsightCards({ cards }: { cards: InsightCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.id} className="relative overflow-hidden rounded-card border border-line bg-paper pl-4">
          <span className={`absolute inset-y-0 left-0 w-[3px] ${ACCENT_CLASS[card.tone]}`} aria-hidden />
          <div className="flex h-full flex-col gap-2.5 p-4 pl-1">
            <div className="flex items-center gap-2">
              {card.agentTag && <PersonAvatar kind="agent" initials={card.agentTag} size="sm" />}
              <p className="font-mono text-[9px] font-medium text-ink-4">{card.meta}</p>
            </div>
            <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
            <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
            <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${FOOTNOTE_CLASS[card.tone]}`}>
              {card.footnote}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
