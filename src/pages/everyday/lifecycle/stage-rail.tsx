import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENT_COLORS, EYEBROW_CLASS, type Stage } from "@/pages/everyday/lifecycle/data";

export type StageRailProps = {
  stages: Stage[];
  /** Live advocacy-loop callout body, when GET /lifecycle/map returned a matching one. Omit to hide the banner rather than show stale copy. */
  advocacyNote?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

const HINT_VISIBLE_MS = 5000;

// Portaled to document.body and positioned via getBoundingClientRect on open, not CSS
// absolute-positioning within the card: the card row scrolls horizontally with overflow-x-auto,
// which forces overflow-y to clip too (a CSS quirk), so a tooltip positioned relative to its
// card would get cut off. createPortal is already used elsewhere in this repo (see
// stage/overview/overview-tab.tsx's headerActionsEl slot) so this is a proven-safe pattern under
// this repo's preact/compat setup. Plain JS positioning, no Radix Tooltip — see
// preact_radix_dialog_crash memory on why Radix's Presence-based components misbehave here.
export function InfoTooltip({ missingSource, wouldUnlock }: { missingSource?: string; wouldUnlock?: string }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; centerX: number } | null>(null);
  // Computed after the box mounts and its real width is known — undefined until then, so the box
  // renders invisibly at a guessed spot for one frame rather than flashing off-screen at the edge.
  const [placement, setPlacement] = useState<{ left: number; arrowLeft: number } | null>(null);
  const hasContent = !!missingSource || !!wouldUnlock;

  const open = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPlacement(null);
    setAnchor({ top: rect.bottom + 8, centerX: rect.left + rect.width / 2 });
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  // Clamps the box within the viewport (it would otherwise overflow off-screen when its trigger
  // sits near the right edge — e.g. a table's last column) and keeps the arrow pointing at the
  // trigger's true center rather than the box's, which the clamp can shift away from center.
  useLayoutEffect(() => {
    if (!isOpen || !anchor || !boxRef.current) return;
    const margin = 12;
    const boxWidth = boxRef.current.offsetWidth;
    const left = Math.max(margin, Math.min(anchor.centerX - boxWidth / 2, window.innerWidth - boxWidth - margin));
    const arrowLeft = Math.max(12, Math.min(anchor.centerX - left, boxWidth - 12));
    setPlacement({ left, arrowLeft });
  }, [isOpen, anchor]);

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={hasContent ? 0 : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        className="inline-flex cursor-help items-center text-ink-4"
      >
        <Info className="size-4" aria-hidden />
      </span>
      {isOpen &&
        anchor &&
        hasContent &&
        createPortal(
          <div
            role="tooltip"
            // Left starts at 0, not anchor.centerX, while unmeasured: an unconstrained
            // position:fixed box sizes itself by shrink-to-fit against the *remaining* viewport
            // width from `left` to the edge, so anchoring the first (hidden) render near the
            // right edge would squeeze the box's own natural width down before it's ever
            // measured — the exact bug a previous version of this fix had, confirmed by measuring
            // the rendered box at 101px wide instead of its true ~256px.
            style={{ top: anchor.top, left: placement ? placement.left : 0, visibility: placement ? "visible" : "hidden" }}
            className="pointer-events-none fixed z-50"
          >
            <div ref={boxRef} className="relative flex max-w-64 flex-col gap-1.5 rounded-2xl bg-ink px-3.5 py-2.5 text-[11.5px] leading-snug text-paper shadow-lg">
              <span className="absolute -top-1.5 size-3 rotate-45 rounded-xs bg-ink" style={{ left: (placement?.arrowLeft ?? 0) - 6 }} aria-hidden />
              {missingSource && (
                <p>
                  <span className="text-paper/60">Missing: </span>
                  {missingSource}
                </p>
              )}
              {wouldUnlock && (
                <p>
                  <span className="text-paper/60">Would unlock: </span>
                  {wouldUnlock}
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export function StageRail({ stages, advocacyNote, isLoading, isError, onRetry }: StageRailProps) {
  const hasUnavailableAmount = stages.some((stage) => stage.amount === "Unavailable");
  const [showHint, setShowHint] = useState(false);

  // Auto-shows once the cards are actually on screen, holds briefly, then fades — teaches that
  // the dotted "—" is hoverable (it was reading as clickable on its own) without needing a
  // Radix tooltip/coachmark, which crashes/flickers under this repo's preact/compat setup (see
  // preact_radix_dialog_crash memory). Not anchored to a specific card: the row scrolls
  // horizontally with overflow-x-auto, which forces overflow-y to clip too, so an
  // absolutely-positioned bubble pointing at one card would get cut off.
  useEffect(() => {
    if (isLoading || isError || !hasUnavailableAmount) return;

    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), HINT_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [isLoading, isError, hasUnavailableAmount]);

  return (
    <section aria-labelledby="stage-rail-eyebrow">
      <p id="stage-rail-eyebrow" className={EYEBROW_CLASS}>
        Revenue at each stage, and what is leaking out of it
      </p>

      {!isLoading && !isError && hasUnavailableAmount && (
        <div
          className={cn(
            "grid overflow-hidden transition-all duration-500 ease-out",
            showHint ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 pb-1.5">
            <div className="relative inline-flex max-w-57.5 items-start gap-1.5 rounded-2xl bg-ink px-3.5 py-2.5 text-[11.5px] leading-snug text-paper shadow-lg">
              <span className="absolute -bottom-1.5 left-5 size-3 rotate-45 rounded-xs bg-ink" aria-hidden />
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>Hover the info icon on a card to see why it's unavailable</span>
            </div>
          </div>
        </div>
      )}

      {isError ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load the lifecycle map.</p>
          {onRetry && (
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-3 flex snap-x gap-1.5 overflow-x-auto pb-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="w-36 shrink-0 snap-start rounded-card border border-line bg-paper-2 p-3">
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="mt-1.5 h-3.5 w-16" />
                  <Skeleton className="mt-2.5 h-3.5 w-10" />
                  <Skeleton className="mt-1 h-2 w-20" />
                  <div className="my-2.5 border-t border-dashed border-line" />
                  <Skeleton className="h-4 w-14" />
                </div>
              ))
            : stages.map((stage) => (
                <Link
                  key={stage.slug}
                  to={`/lifecycle/${stage.slug}`}
                  className={cn(
                    "w-36 shrink-0 snap-start rounded-card border border-line p-3 transition-colors hover:border-ink-4",
                    stage.name === "Churn" ? "bg-rose-bg/60" : "bg-paper-2"
                  )}
                >
                  <span
                    className="inline-block size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: stage.department ? DEPARTMENT_COLORS[stage.department] : "var(--color-ink-4)" }}
                    aria-hidden
                  />
                  <p className="mt-1.5 text-[13px] font-semibold text-ink">{stage.name}</p>

                  {/* Metric stat tile — same value-or-icon shape as the amount tile below, every
                      card renders one: a formatted value when the headline computes for this
                      stage, or the InfoTooltip icon in its place when it's gated. The label
                      caption is always shown (all 10 stages carry one) so a gated stage still
                      names the concept instead of a bare, unexplained icon. */}
                  <div className="mt-2 min-h-9">
                    {stage.metricValue ? (
                      <p className="text-[12px] font-semibold text-ink-2">{stage.metricValue}</p>
                    ) : (
                      <InfoTooltip missingSource={stage.metricCaveat} wouldUnlock={stage.metricWouldUnlock} />
                    )}
                    {stage.metricLabel && (
                      <p className="mt-0.5 truncate font-mono text-[8.5px] text-ink-4" title={stage.metricLabel}>
                        {stage.metricLabel}
                      </p>
                    )}
                  </div>

                  <div className="my-2.5 border-t border-dashed border-line" />

                  {stage.amount === "Unavailable" ? (
                    <InfoTooltip missingSource={stage.amountCaveat} wouldUnlock={stage.amountWouldUnlock} />
                  ) : (
                    <p className={cn("text-[15px] font-semibold", stage.amountLabel === "referred" ? "text-teal" : "text-rose")}>
                      {stage.amount}
                    </p>
                  )}
                </Link>
              ))}
        </div>
      )}

      {!isError &&
        (isLoading ? (
          <Skeleton className="mt-3 h-11 w-full" />
        ) : (
          advocacyNote && (
            <div className="mt-3 flex items-start gap-2 rounded-panel border border-teal-border bg-teal-bg px-3.5 py-2.5">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-teal" aria-hidden />
              <p className="text-[11px] text-teal">{advocacyNote}</p>
            </div>
          )
        ))}
    </section>
  );
}
