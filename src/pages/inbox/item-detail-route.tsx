import { Link, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { INBOX_ITEM_BANNER, INBOX_ITEM_DETAILS } from "@/pages/inbox/data";

const ACTION_CARD_TONE_CLASS = {
  ultra: "border-ultra-border bg-ultra-bg",
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
  rose: "border-rose-border bg-rose-bg",
  neutral: "border-line bg-paper-2",
} as const;

/** I04 — only "i-8f2c" has a fully-built detail page, same "one reference row" pattern as every prior rebuild's :id drilldowns. */
const ItemDetailRoute = () => {
  const { id } = useParams();
  const detail = id ? INBOX_ITEM_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">This item does not have a full page yet</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">Only the reactivation approval's inbox page is built.</p>
        <Link to="/inbox" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to your inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Inbox", to: "/inbox" }, { label: detail.title }]}
        title={detail.title}
        subtitle={detail.subtitle}
        action={
          <Button asChild>
            <Link to={`/rooms/${detail.roomId}/plays`}>Review in the room</Link>
          </Button>
        }
      />

      <div className="rounded-card border-2 border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{INBOX_ITEM_BANNER.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{INBOX_ITEM_BANNER.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you can see from here
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {detail.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] text-ink-3">{fact.label}</span>
              <span className={cn("text-right text-[11px] font-medium sm:max-w-[60%]", fact.tone ? TONE_TEXT_CLASS[fact.tone] : "text-ink-2")}>
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you can do from here
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {detail.actionCards.map((card) => (
            <div key={card.label} className={cn("flex flex-col justify-between rounded-card border p-4", ACTION_CARD_TONE_CLASS[card.tone])}>
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
    </div>
  );
};

export default ItemDetailRoute;
