import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A panel whose list can grow long (objections, falsifiers): the header collapses the whole body,
 * the list scrolls inside a capped height, and the input form (`footer`) sits outside the scroll
 * area so it never scrolls away with the list.
 */
export function CollapsiblePanel({
  title,
  count,
  intro,
  footer,
  children,
  // Starts collapsed: these lists can get long, and the count badge still says how full they are.
  defaultOpen = false,
}: {
  title: string;
  /** Total items in the list, shown next to the title so a collapsed panel still says how full it is. */
  count: number;
  /** Fixed explanatory text above the list (does not scroll). */
  intro?: React.ReactNode;
  /** The input form (does not scroll). */
  footer: React.ReactNode;
  /** The list; this is the part that scrolls. */
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const bodyId = React.useId();

  return (
    <section className="overflow-hidden rounded-card border border-line bg-paper">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left outline-none hover:bg-paper-2/60 focus-visible:bg-paper-2/60"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold text-ink">{title}</span>
          <span className="rounded-full bg-paper-2 px-2 font-mono text-[10.5px] leading-5 text-ink-3">{count}</span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-ink-3 transition-transform duration-300", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {/* Slides open and shut by animating the grid row between 0fr and 1fr (no fixed height needed).
          `invisible` while shut keeps the hidden controls out of the tab order. */}
      <div
        id={bodyId}
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out",
          open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line">
            {intro}
            <div className="max-h-80 overflow-y-auto overscroll-contain">{children}</div>
            <div className="border-t border-line">{footer}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
