import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type Align = "start" | "center" | "end";

/**
 * A click-triggered floating card, portaled to `document.body` and positioned with plain
 * `getBoundingClientRect` math instead of Radix's Popper — this page's matrix cells sit inside
 * an `overflow-x-auto` scrolling ancestor, and Radix's collision/flip math has a documented
 * history of misbehaving in exactly that setup on this codebase (see info-tooltip.tsx's own
 * comment and [[preact_radix_dialog_crash]]): a trigger near the bottom of a long scrolling page
 * opened its card off-screen instead of flipping above. This mirrors InfoTooltip's proven
 * pattern, generalized to click-toggle + arbitrary rich content instead of hover + two lines.
 */
export function FloatingCard({
  renderTrigger,
  children,
  align = "center",
  panelClassName,
}: {
  renderTrigger: (props: {
    open: boolean;
    toggle: () => void;
    ref: (node: HTMLButtonElement | null) => void;
  }) => React.ReactNode;
  children: React.ReactNode;
  align?: Align;
  panelClassName?: string;
}) {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<{ top: number; left: number } | null>(null);

  const setTriggerRef = React.useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node;
  }, []);

  const toggle = () => setOpen((o) => !o);
  const close = React.useCallback(() => setOpen(false), []);

  // Computed after the card mounts and its real size is known — see info-tooltip.tsx for why an
  // unmeasured render at a guessed spot (rather than skipping straight to the true position)
  // would size the card wrong before ever being measured.
  React.useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const card = cardRef.current;
    if (!trigger || !card) return;

    const margin = 12;
    const gap = 8;
    const triggerBox = trigger.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    let left =
      align === "start"
        ? triggerBox.left
        : align === "end"
          ? triggerBox.right - cardWidth
          : triggerBox.left + triggerBox.width / 2 - cardWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - cardWidth - margin));

    const spaceBelow = window.innerHeight - triggerBox.bottom;
    const spaceAbove = triggerBox.top;
    const openBelow = spaceBelow >= cardHeight + gap + margin || spaceBelow >= spaceAbove;
    const top = openBelow
      ? triggerBox.bottom + gap
      : Math.max(margin, triggerBox.top - cardHeight - gap);

    setPlacement({ top, left });
  }, [open, align]);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || cardRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // Capture phase so scrolling inside a nested scroll container (the matrix's own
    // overflow-x-auto) still dismisses the card instead of leaving it at a stale position.
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("scroll", close, true);
    };
  }, [open, close]);

  return (
    <>
      {renderTrigger({ open, toggle, ref: setTriggerRef })}
      {open &&
        createPortal(
          <div
            ref={cardRef}
            role="dialog"
            style={{
              position: "fixed",
              top: placement?.top ?? 0,
              left: placement?.left ?? 0,
              visibility: placement ? "visible" : "hidden",
            }}
            className={cn("z-50 rounded-panel border border-line bg-paper shadow-lg", panelClassName)}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}
