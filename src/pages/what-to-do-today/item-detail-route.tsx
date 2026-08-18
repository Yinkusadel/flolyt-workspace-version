import { Link, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { ITEM_DETAILS, TODAY_ITEMS } from "@/pages/what-to-do-today/data";

const REASON_TONE_CLASS = {
  ultra: "border-ultra-border bg-ultra-bg",
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
} as const;

const REASON_FOOTNOTE_CLASS = {
  ultra: "text-ultra",
  amber: "text-amber",
  teal: "text-teal",
} as const;

/**
 * T06 — only the #1 ranked item ("r-8f2c") has a fully-built detail page,
 * same "one reference row" pattern as Price's plans/:id. Every other id
 * falls back to the not-found state below.
 */
const ItemDetailRoute = () => {
  const { id } = useParams();
  const detail = id ? ITEM_DETAILS[id] : undefined;
  const room = TODAY_ITEMS.find((item) => item.id === id);

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">This item does not have a full page yet</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">Only the top-ranked item's recommendation page is built.</p>
        <Link to="/what-to-do-today" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to What to do today
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "What to do today", to: "/what-to-do-today" }, { label: detail.title }]}
        title={detail.title}
        subtitle={detail.subtitle}
        action={room ? <Button>Open the room</Button> : undefined}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {detail.stats.map((stat) => (
          <div key={stat.label} className="rounded-card border border-line bg-paper p-4">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{stat.label}</p>
            <p className={cn("mt-2.5 text-[19px] font-semibold", stat.tone ? TONE_TEXT_CLASS[stat.tone] : "text-ink")}>
              {stat.value}
            </p>
            <p className="mt-1 text-[10px] text-ink-4">{stat.caption}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Why this is the first thing</p>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {detail.reasonCards.map((card) => (
            <div key={card.eyebrow} className={cn("flex flex-col justify-between rounded-card border p-4", REASON_TONE_CLASS[card.tone])}>
              <div>
                <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{card.eyebrow}</p>
                <p className="mt-1.5 text-[12.5px] font-semibold text-ink">{card.heading}</p>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{card.body}</p>
              </div>
              <p className={cn("mt-3 border-t border-line pt-2.5 text-[10px] font-semibold", REASON_FOOTNOTE_CLASS[card.tone])}>
                {card.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Everything already settled, so you do not have to check it
        </p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {detail.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] text-ink-2">{fact.label}</span>
              <span className={cn("text-right font-mono text-[10.5px]", fact.tone ? TONE_TEXT_CLASS[fact.tone] : "text-ink-4")}>
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Callout tone="teal" title={detail.closing.title}>
        {detail.closing.body}
      </Callout>
    </div>
  );
};

export default ItemDetailRoute;
