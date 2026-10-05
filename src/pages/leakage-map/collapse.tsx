import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Slides its children open and closed. The height is measured and animated with an inline style, so it
 * does not depend on CSS grid-row interpolation or on any utility class being generated, and it works the
 * same in every browser. A ResizeObserver keeps the open height right when the text rewraps. Always
 * mounted, so it animates closed as well as open.
 */
export function Collapse({ open, id, children }: { open: boolean; id?: string; children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Closed content is hidden from sight, so it must also be unreachable by keyboard and assistive tech.
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setContentHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      id={id}
      aria-hidden={!open}
      style={{
        height: open ? contentHeight : 0,
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "height 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease-out",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/**
 * A section header where any part of it (title, aside, extra lines) opens and closes the body. The title button
 * is the keyboard and screen-reader control; its click bubbles to the wrapper, so it toggles exactly once.
 * `bodyId` must match the `id` of the Collapse it controls.
 */
export function ToggleHeader({
  open,
  onToggle,
  bodyId,
  title,
  aside,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  bodyId: string;
  title: ReactNode;
  /** Right-hand content on the title row (a status chip, a label). */
  aside?: ReactNode;
  /** Extra header lines under the title row that also toggle. */
  children?: ReactNode;
}) {
  return (
    <div onClick={onToggle} className="cursor-pointer select-none">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink">
          <button type="button" aria-expanded={open} aria-controls={bodyId} className="flex items-center gap-1.5 text-left hover:text-ink-2">
            {title}
            <ChevronDown className={cn("size-3.5 shrink-0 text-ink-3 transition-transform", !open && "-rotate-90")} />
          </button>
        </h2>
        {aside}
      </div>
      {children}
    </div>
  );
}
