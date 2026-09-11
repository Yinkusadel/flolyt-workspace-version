import { type ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessagesSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EYEBROW_CLASS = "font-mono text-[8.6px] font-medium tracking-[0.85px] text-ink-4";

const CARD_WIDTH = 296;
const CARD_HEIGHT = 336;
/** Horizontal distance between a card and its neighbor, in px — tuned so neighbors peek
 *  out from behind the focused card rather than sitting fully clear of it. */
const NEIGHBOR_OFFSET = 244;
const NEIGHBOR_SCALE = 0.88;
const NEIGHBOR_OPACITY = 0.5;

/** Uniform shape every slide renders into, so the deck reads as one consistent object
 *  cycling through states rather than three differently-proportioned cards. */
function CarouselCardFrame({
  eyebrow,
  children,
  footer,
}: {
  eyebrow: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col p-5.5">
      <p className={EYEBROW_CLASS}>{eyebrow}</p>
      <div className="mt-4 min-h-0 flex-1">{children}</div>
      <div className="mt-4 shrink-0">{footer}</div>
    </div>
  );
}

function PastWeekCard() {
  return (
    <CarouselCardFrame
      eyebrow="PAST 7 DAYS"
      footer={
        <Button variant="outline" size="sm" className="w-full">
          See what needs you
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-serif text-2xl text-ink">$412K</p>
          <p className="mt-1 font-mono text-[8.5px] font-medium tracking-[0.05em] text-ink-4">AT RISK</p>
        </div>
        <div>
          <p className="font-serif text-2xl text-ink">3</p>
          <p className="mt-1 font-mono text-[8.5px] font-medium tracking-[0.05em] text-ink-4">ROOMS</p>
        </div>
        <div>
          <p className="font-serif text-2xl text-ink">1</p>
          <p className="mt-1 font-mono text-[8.5px] font-medium tracking-[0.05em] text-ink-4">FOR YOU</p>
        </div>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className="flex items-center gap-1.5 font-serif text-[15px] text-ultra">
          <span className="size-1.5 shrink-0 rounded-full bg-ultra" aria-hidden />
          1 approval waiting
        </p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-3">
          Room 2471 · you are the named approver
        </p>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className={EYEBROW_CLASS}>BIGGEST EXPOSURE</p>
        <p className="mt-1.5 text-[12px] leading-relaxed font-semibold text-ink">
          Second-order rate fell 38% to 27% after 4 March
        </p>
      </div>
    </CarouselCardFrame>
  );
}

function NeedsYouCard() {
  const items = [
    { body: "Finance's objection is still open on Room 2471", action: "Open the room" },
    { body: "Zendesk stopped syncing six hours ago", action: "Reconnect" },
    { body: "Warehouse COGS is not connected, so margin reads Unavailable", action: "Connect a source" },
  ];

  return (
    <CarouselCardFrame
      eyebrow="NEEDS YOU"
      footer={
        <Button variant="outline" size="sm" className="w-full">
          Open the inbox
        </Button>
      }
    >
      <p className="font-serif text-[18px] text-ink">3 things need you</p>
      <div className="mt-3 divide-y divide-line">
        {items.map((item) => (
          <div key={item.body} className="py-2.5 first:pt-0 last:pb-0">
            <p className="text-[11.5px] leading-snug text-ink-2">{item.body}</p>
            <p className="mt-1 text-[11.5px] font-medium text-ultra">{item.action} →</p>
          </div>
        ))}
      </div>
    </CarouselCardFrame>
  );
}

function EarlierRoomsCard() {
  return (
    <CarouselCardFrame
      eyebrow="EARLIER ROOMS"
      footer={
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/rooms">View all</Link>
        </Button>
      }
    >
      <div className="flex h-full flex-col items-center justify-center text-center">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-paper-2">
          <MessagesSquare className="size-4.5 text-ink-4" />
        </span>
        <p className="mt-3.5 text-[14.5px] font-semibold text-ink">Rooms waiting on you</p>
        <p className="mt-1.5 max-w-52 text-[12px] leading-relaxed text-ink-3">
          Rooms you haven't answered yet are waiting for you on the rooms page.
        </p>
      </div>
    </CarouselCardFrame>
  );
}

const SLIDES = [
  { id: "past-week", content: <PastWeekCard /> },
  { id: "needs-you", content: <NeedsYouCard /> },
  { id: "earlier-rooms", content: <EarlierRoomsCard /> },
];

const COUNT = SLIDES.length;

/** Shortest circular distance from `active` to `index`, e.g. -1, 0, or 1 for a 3-card deck. */
function circularOffset(index: number, active: number, count: number) {
  let diff = index - active;
  const half = count / 2;
  if (diff > half) diff -= count;
  if (diff < -half) diff += count;
  return diff;
}

/**
 * Peek carousel below the home composer — a fixed set of 3 cards (illustrative content
 * pending real data) cycling through a shared, uniformly-sized frame so only the numbers
 * change, never the shape. The focused card sits centered at full scale; its neighbors
 * peek from behind at reduced scale/opacity, all animated with one transform transition.
 */
export function HomeCarousel() {
  const [active, setActive] = useState(0);
  const goTo = (index: number) => setActive(((index % COUNT) + COUNT) % COUNT);

  return (
    <div className="mt-6 flex w-full flex-col items-center duration-500 animate-in fade-in slide-in-from-bottom-2 delay-300">
      <div className="relative w-full" style={{ height: CARD_HEIGHT }}>
        {SLIDES.map((slide, index) => {
          const offset = circularOffset(index, active, COUNT);
          const isActive = offset === 0;
          const translateX = offset * NEIGHBOR_OFFSET;
          const scale = isActive ? 1 : NEIGHBOR_SCALE;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={isActive ? undefined : `Show ${slide.id.replace("-", " ")} card`}
              aria-current={isActive}
              tabIndex={isActive ? -1 : 0}
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
                isActive ? "cursor-default shadow-xl" : "cursor-pointer hover:opacity-75"
              )}
            >
              <div className={cn(!isActive && "pointer-events-none")}>{slide.content}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Previous card"
          className="text-ink-4 transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4" />
        </button>

        {SLIDES.map((slide, index) => (
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
    </div>
  );
}
