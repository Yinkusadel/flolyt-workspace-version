import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Generic hover tooltip for arbitrary text content (full participant lists, untruncated message
 * previews). Portaled to `document.body` and positioned via `getBoundingClientRect` rather than
 * Radix's `Tooltip` — see the `preact-radix-dialog-crash` memory: `@radix-ui/react-presence`
 * (what Tooltip's enter/exit animation relies on) flickers under this repo's preact/compat setup.
 * Mirrors `InfoTooltip`'s positioning approach, generalized to wrap any trigger children instead
 * of a fixed info-icon layout.
 */
export function TextTooltip({
  content,
  children,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{ top: number; centerX: number } | null>(null);
  const [placement, setPlacement] = React.useState<{ left: number; arrowLeft: number } | null>(null);

  const open = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPlacement(null);
    setAnchor({ top: rect.bottom + 8, centerX: rect.left + rect.width / 2 });
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  // Clamps the box within the viewport and keeps the arrow pointing at the trigger's true center
  // rather than the box's, which the clamp can shift away from — see InfoTooltip for the same fix.
  React.useLayoutEffect(() => {
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
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        className={className}
      >
        {children}
      </span>
      {isOpen &&
        anchor &&
        createPortal(
          <div
            role="tooltip"
            style={{ top: anchor.top, left: placement ? placement.left : 0, visibility: placement ? "visible" : "hidden" }}
            className="pointer-events-none fixed z-50"
          >
            <div
              ref={boxRef}
              className="relative max-w-72 rounded-xl bg-ink px-3 py-2 text-[11.5px] leading-snug wrap-break-word text-paper shadow-lg"
            >
              <span
                className="absolute -top-1.5 size-3 rotate-45 rounded-xs bg-ink"
                style={{ left: (placement?.arrowLeft ?? 0) - 6 }}
                aria-hidden
              />
              {content}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
