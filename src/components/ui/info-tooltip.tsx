import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

// Portaled to document.body and positioned via getBoundingClientRect on open, not CSS
// absolute-positioning within the card: a card row that scrolls horizontally with overflow-x-auto
// forces overflow-y to clip too (a CSS quirk), so a tooltip positioned relative to its card would
// get cut off. Plain JS positioning, no Radix Tooltip — see preact_radix_dialog_crash memory on
// why Radix's Presence-based components misbehave here.
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
