import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MAPPING_QUESTIONS, PAYMENT_CATEGORY } from "@/pages/onboarding/data/data";

/**
 * flolyt-figma-designs/onboarding/06-source-connected.svg's right rail. Desktop only — hidden
 * below lg, same reasoning as WhatSourceUnlocks. Which dots light up depends on what category
 * was actually connected, not the design's fixed Postgres-only example: a Payments source
 * answers the two money questions, any other source answers the other three. When only one
 * side is connected, the "connect the other" box swaps between the two shapes; once both sides
 * are connected there is nothing left to ask for, so the box goes away entirely.
 */
export function WhatYouCanAskNow({
  connectedCategories,
  onConnectStripe,
  onConnectProductSource,
}: {
  connectedCategories: Set<string>;
  onConnectStripe: () => void;
  onConnectProductSource: () => void;
}) {
  const hasPayment = connectedCategories.has(PAYMENT_CATEGORY);
  const hasOtherSource = Array.from(connectedCategories).some((c) => c !== PAYMENT_CATEGORY);
  const hasBoth = hasPayment && hasOtherSource;

  return (
    <aside className="hidden w-100 shrink-0 overflow-y-auto border-l border-line bg-paper-2 p-8 lg:block">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
        What you can ask now
      </p>

      <div className="mt-6 space-y-5">
        {MAPPING_QUESTIONS.map((item) => {
          const unlocked = hasBoth || (item.needsPayment ? hasPayment : hasOtherSource);
          return (
            <div key={item.key} className="flex items-center gap-3">
              <span
                className={cn("size-2 shrink-0 rounded-full", unlocked ? "bg-teal" : "bg-line")}
                aria-hidden
              />
              <p className={cn("text-[12px]", unlocked ? "text-ink-2" : "text-ink-4")}>{item.question}</p>
            </div>
          );
        })}
      </div>

      {!hasBoth && (
        <div className="mt-10 rounded-card border border-dashed border-line bg-paper p-4">
          {hasPayment ? (
            <>
              <p className="text-[12.5px] font-semibold text-ink">Three questions need a product source</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
                Without one, Flolyt can tell you what customers paid but not what they did — repeat
                purchase, dormancy, and where revenue is leaking will read "unavailable" rather than
                estimate, which is the honest answer, not a broken one.
              </p>
              <Button type="button" onClick={onConnectProductSource} className="mt-4 h-8">
                Connect a product source
              </Button>
            </>
          ) : (
            <>
              <p className="text-[12.5px] font-semibold text-ink">Two questions need a payments source</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
                Without one, Flolyt can tell you a cohort is slipping but not what it is worth. It will
                read "unavailable" rather than estimate — which is the honest answer, not a broken one.
              </p>
              <Button type="button" onClick={onConnectStripe} className="mt-4 h-8">
                Connect Stripe next
              </Button>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
