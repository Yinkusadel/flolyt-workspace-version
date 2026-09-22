import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGetHome } from "@/features/home/use-get-home";
import { splitHomeCardsByKind } from "@/features/home/group-home-cards";
import type { HomeCard, HomeExposure, HomeFact, HomeFigure, HomeGuarded } from "@/services/api/home/get-home";

const EYEBROW_CLASS = "font-mono text-[8.6px] font-medium tracking-[0.85px] text-ink-4";

const CARD_WIDTH = 296;
const CARD_HEIGHT = 336;
/** Horizontal distance between a card and its neighbor, in px — tuned so neighbors peek
 *  out from behind the focused card rather than sitting fully clear of it. */
const NEIGHBOR_OFFSET = 244;
const NEIGHBOR_SCALE = 0.88;
const NEIGHBOR_OPACITY = 0.5;

/** Uniform shape every slide renders into, so the deck reads as one consistent object cycling
 *  through states rather than differently-proportioned cards. The content region is a flex
 *  column with a definite height (inherited from the fixed-height slide two levels up — see the
 *  `h-full` note where slides are rendered) so a scrollable child inside it (`min-h-0 flex-1
 *  overflow-y-auto`) actually clips/scrolls instead of silently growing to fit its content. */
function CarouselCardFrame({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col p-5.5">
      <p className={EYEBROW_CLASS}>{eyebrow}</p>
      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}

function formatFigure({ amount, currency }: HomeFigure) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

const STAT_LABEL_CLASS = "mt-1 font-mono text-[8.5px] font-medium tracking-[0.05em] text-ink-4";

function GuardedCard({ guarded }: { guarded: HomeGuarded }) {
  const preservedText = guarded.preserved.length > 0 ? guarded.preserved.map(formatFigure).join(" + ") : "—";

  return (
    <CarouselCardFrame eyebrow={`PAST ${guarded.days} DAY${guarded.days === 1 ? "" : "S"}`}>
      <div className="grid shrink-0 grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-serif text-2xl text-ink">{preservedText}</p>
          <p className={STAT_LABEL_CLASS}>PRESERVED</p>
        </div>
        <div>
          <p className="font-serif text-2xl text-ink">{guarded.roomsClosed}</p>
          <p className={STAT_LABEL_CLASS}>ROOMS</p>
        </div>
        <div>
          <p className="font-serif text-2xl text-ink">{guarded.decisionsWaitingOnYou}</p>
          <p className={STAT_LABEL_CLASS}>FOR YOU</p>
        </div>
      </div>

      {guarded.decisionsWaitingOnYou > 0 && (
        <p className="mt-4 flex shrink-0 items-center gap-1.5 border-t border-line pt-4 font-serif text-[15px] text-ultra">
          <span className="size-1.5 shrink-0 rounded-full bg-ultra" aria-hidden />
          {guarded.decisionsWaitingOnYou} decision{guarded.decisionsWaitingOnYou === 1 ? "" : "s"} waiting on you
        </p>
      )}

      {guarded.biggestExposure.length > 0 && (
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto border-t border-line pt-4">
          <p className={EYEBROW_CLASS}>BIGGEST EXPOSURE</p>
          <div className="mt-2 space-y-3">
            {guarded.biggestExposure.map((exposure, index) => (
              <ExposureRow key={exposure.roomId ?? `${exposure.currency}-${index}`} exposure={exposure} />
            ))}
          </div>
        </div>
      )}
    </CarouselCardFrame>
  );
}

function ExposureRow({ exposure }: { exposure: HomeExposure }) {
  const titleClass = "line-clamp-2 text-[12px] leading-relaxed font-semibold";
  return (
    <div>
      {exposure.roomId ? (
        <Link to={`/rooms/${exposure.roomId}`} className={cn(titleClass, "text-ultra hover:underline")}>
          {exposure.title}
        </Link>
      ) : (
        <p className={cn(titleClass, "text-ink")}>{exposure.title}</p>
      )}
      <p className="mt-0.5 font-serif text-[13px] text-ink-3">{formatFigure(exposure)}</p>
    </div>
  );
}

function FactsCard({ facts, onAsk }: { facts: HomeFact[]; onAsk: (question: string) => void }) {
  return (
    <CarouselCardFrame eyebrow="REVENUE FACTS">
      <p className="shrink-0 font-serif text-[18px] text-ink">
        {facts.length} thing{facts.length === 1 ? "" : "s"} worth knowing
      </p>
      <div className="mt-3 min-h-0 flex-1 divide-y divide-line overflow-y-auto">
        {facts.map((fact) => (
          <div key={fact.key} className="py-2.5 first:pt-0 last:pb-0">
            <p className="line-clamp-2 text-[11.5px] leading-snug text-ink-2">{fact.text}</p>
            {fact.figures.length > 0 && (
              <p className="mt-1 font-serif text-[15px] text-ink">{fact.figures.map(formatFigure).join(" + ")}</p>
            )}
            <button
              type="button"
              onClick={() => onAsk(fact.question)}
              className="mt-1 text-[11.5px] font-medium text-ultra hover:underline"
            >
              Ask about this →
            </button>
          </div>
        ))}
      </div>
    </CarouselCardFrame>
  );
}

/** One row inside a `cards[]`-backed panel — a card's title carries the link (per this app's
 *  link-hover convention) when it has an href; cards with no href just render as plain text. */
function CardRow({ card }: { card: HomeCard }) {
  const titleClass = "line-clamp-2 text-[11.5px] leading-snug font-medium";
  const title = card.href ? (
    <Link to={card.href} className={cn(titleClass, "text-ultra hover:underline")}>
      {card.title}
    </Link>
  ) : (
    <p className={cn(titleClass, "text-ink-2")}>{card.title}</p>
  );

  return (
    <div className="py-2.5 first:pt-0 last:pb-0">
      {title}
      {card.detail && (
        <p className="mt-1 line-clamp-1 text-[11px] leading-snug text-ink-4">{card.detail}</p>
      )}
      {card.figures.length > 0 && (
        <p className="mt-1 font-serif text-[15px] text-ink">{card.figures.map(formatFigure).join(" + ")}</p>
      )}
    </div>
  );
}

interface CardListPanelProps {
  eyebrow: string;
  headline: string;
  items: HomeCard[];
}

/** Shared shape for the two `cards[]`-backed panels below — every item in the group is shown,
 *  scrolling within the fixed card height rather than capping items behind a "+N more" link
 *  that doesn't go to those specific items. */
function CardListPanel({ eyebrow, headline, items }: CardListPanelProps) {
  return (
    <CarouselCardFrame eyebrow={eyebrow}>
      <p className="shrink-0 font-serif text-[18px] text-ink">{headline}</p>
      <div className="mt-3 min-h-0 flex-1 divide-y divide-line overflow-y-auto">
        {items.map((card) => (
          // `card.key` is a category key (e.g. "decision", "system"), shared by every card of
          // that kind — not a per-row id — so it can't be the React key on its own.
          <CardRow key={card.sourceId ?? `${card.key}-${card.asOfUtc}`} card={card} />
        ))}
      </div>
    </CarouselCardFrame>
  );
}

function NeedsYouCard({ items }: { items: HomeCard[] }) {
  return (
    <CardListPanel
      eyebrow="NEEDS YOU"
      headline={`${items.length} thing${items.length === 1 ? "" : "s"} need you`}
      items={items}
    />
  );
}

/** Shortest circular distance from `active` to `index`, e.g. -1, 0, or 1 for a 3-card deck. */
function circularOffset(index: number, active: number, count: number) {
  let diff = index - active;
  const half = count / 2;
  if (diff > half) diff -= count;
  if (diff < -half) diff += count;
  return diff;
}

/**
 * Peek carousel below the home composer, built from `GET /home`: a `guarded` slide (always
 * shown — what the last N days preserved, closed/open rooms, decisions waiting, biggest
 * exposure), then `facts` (revenue facts worth knowing, each with a question you can ask the
 * agent directly), then a "needs you" slide from `cards[]` (`kind: "action"`, skipped when
 * empty). The other half of `cards[]` — everything the workspace has been told (`kind !==
 * "action"`, see [[splitHomeCardsByKind]]) — lives in the topbar's `NotificationBell`, not here,
 * so those updates are reachable from every screen instead of only this one. All slides cycle
 * through the same uniformly-sized frame so only the content changes, never the shape.
 */
const AUTO_SCROLL_INTERVAL = 5000;

export function HomeCarousel() {
  const { data, isPending, isError } = useGetHome();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const askQuestion = useCallback(
    (question: string) => {
      // Same pattern as the composer's own submit — see NewConversationRoute.handleSubmit.
      navigate("/conversations/new", { state: { bootstrapToken: crypto.randomUUID(), prompt: question } });
    },
    [navigate]
  );

  const slides = useMemo(() => {
    const home = data?.data;
    if (!home) return [];

    const { needsYou } = splitHomeCardsByKind(home.cards);

    const list: Array<{ id: string; content: ReactNode }> = [
      { id: "guarded", content: <GuardedCard guarded={home.guarded} /> },
    ];
    if (home.facts.length > 0) {
      list.push({ id: "facts", content: <FactsCard facts={home.facts} onAsk={askQuestion} /> });
    }
    if (needsYou.length > 0) {
      list.push({ id: "needs-you", content: <NeedsYouCard items={needsYou} /> });
    }
    return list;
  }, [data, askQuestion]);

  const count = slides.length;

  // Reset to the first panel whenever the slide set changes shape (e.g. a refetch drops a
  // group), so `active` never points past the end of a shorter slide list.
  useEffect(() => {
    setActive(0);
  }, [count]);

  const goTo = (index: number) => setActive(((index % count) + count) % count);

  useEffect(() => {
    if (isPaused || count <= 1) return;
    const id = setInterval(() => setActive((current) => (current + 1) % count), AUTO_SCROLL_INTERVAL);
    return () => clearInterval(id);
  }, [isPaused, count]);

  if (isPending) {
    return (
      <div className="mt-6 hidden w-full flex-col items-center sm:flex">
        <div
          className="animate-pulse rounded-card border border-line bg-paper-2"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </div>
    );
  }

  // Nothing to show — an errored fetch gets no carousel at all (this is a supplementary widget
  // below the composer, not critical path). `guarded` always renders when data loaded fine, so
  // count === 0 here only happens on error/no-data.
  if (isError || count === 0) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="mt-6 hidden w-full flex-col items-center duration-500 animate-in fade-in slide-in-from-bottom-2 delay-300 sm:flex"
    >
      <div className="relative w-full" style={{ height: CARD_HEIGHT }}>
        {slides.map((slide, index) => {
          const offset = circularOffset(index, active, count);
          const isActive = offset === 0;
          const translateX = offset * NEIGHBOR_OFFSET;
          const scale = isActive ? 1 : NEIGHBOR_SCALE;

          // Always the same element (a div) at this key across active/inactive states — the
          // card-changing animation is a CSS transition on transform/opacity, which only plays
          // when the same DOM node persists. Swapping the tag (e.g. div vs. button) here would
          // make React remount the node instead of updating it, and the slide would just snap.
          // The active card hosts real interactive CTAs (links/buttons), so it can't itself be a
          // button (nesting those inside a button is invalid HTML) — instead it's a plain div,
          // and only the inactive neighbors pick up the click/keyboard affordance that brings a
          // card into focus.
          return (
            <div
              key={slide.id}
              role={isActive ? undefined : "button"}
              tabIndex={isActive ? undefined : 0}
              aria-label={isActive ? undefined : `Show ${slide.id.replace("-", " ")} card`}
              onClick={isActive ? undefined : () => goTo(index)}
              onKeyDown={
                isActive
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo(index);
                      }
                    }
              }
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                left: "50%",
                top: 0,
                transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale})`,
                opacity: isActive ? 1 : NEIGHBOR_OPACITY,
                zIndex: isActive ? 2 : 1,
              }}
              className={cn(
                "absolute rounded-card border border-line bg-paper text-left transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive ? "shadow-xl" : "cursor-pointer hover:opacity-75"
              )}
            >
              {/* h-full here isn't decorative — CarouselCardFrame's own h-full/flex-1 chain (for
                  clipping/scrolling a panel's list to the card's fixed height) resolves against
                  this element's height, and percentage heights compute as "auto" against a
                  height:auto parent. Without it the frame silently grows to fit all content
                  instead of clipping to CARD_HEIGHT. */}
              <div className={cn("h-full", !isActive && "pointer-events-none")}>{slide.content}</div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous card"
            className="text-ink-4 transition-colors hover:text-ink"
          >
            <ChevronLeft className="size-4" />
          </button>

          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to card ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === active ? "w-4 bg-ink" : "w-1.5 bg-line"
              )}
            />
          ))}

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next card"
            className="text-ink-4 transition-colors hover:text-ink"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
