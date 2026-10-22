import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type PanelTone = "amber" | "teal";

/** Each panel gets its own color on its border, header and footer so the two read apart at a glance.
 *  Full class strings (not built from the tone name) so Tailwind can see them. */
const TONE: Record<PanelTone, { border: string; bg: string; header: string; text: string }> = {
  amber: {
    border: "border-amber-border",
    bg: "bg-amber-bg",
    header: "bg-amber-bg hover:bg-amber-bg/70 focus-visible:bg-amber-bg/70",
    text: "text-amber",
  },
  teal: {
    border: "border-teal-border",
    bg: "bg-teal-bg",
    header: "bg-teal-bg hover:bg-teal-bg/70 focus-visible:bg-teal-bg/70",
    text: "text-teal",
  },
};

/**
 * A panel whose list can grow long (objections, falsifiers): the header collapses the whole body,
 * the list scrolls inside a capped height, and the input form (`footer`) sits outside the scroll
 * area so it never scrolls away with the list.
 */
export function CollapsiblePanel({
  title,
  tone,
  count,
  intro,
  footer,
  children,
  // Starts collapsed: these lists can get long, and the count badge still says how full they are.
  defaultOpen = false,
}: {
  title: string;
  tone: PanelTone;
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
  const colors = TONE[tone];

  return (
    <section className={cn("overflow-hidden rounded-card border bg-paper", colors.border)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left outline-none transition-colors",
          colors.header
        )}
      >
        <span className="flex items-center gap-2.5">
          <span className={cn("text-[13px] font-semibold", colors.text)}>{title}</span>
          <span
            className={cn(
              "rounded-full border bg-paper px-2 font-mono text-[10.5px] leading-5 font-semibold",
              colors.border,
              colors.text
            )}
          >
            {count}
          </span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform duration-300", colors.text, open && "rotate-180")}
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
          <div className={cn("border-t", colors.border)}>
            {intro}
            <div className="max-h-80 overflow-y-auto overscroll-contain">{children}</div>
            <div className={cn("border-t", colors.border, colors.bg)}>{footer}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
