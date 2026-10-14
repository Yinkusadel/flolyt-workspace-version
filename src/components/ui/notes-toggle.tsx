import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The small info icon that shows or hides a page's notes (the Leakage Map's pattern): amber with a count while a
 * warning is waiting, neutral otherwise, and the count disappears once the notes are open.
 * `controlsId` must match the `id` of the Collapse it opens.
 */
export function NotesToggle({
  count,
  warning,
  open,
  onToggle,
  controlsId,
  subject,
}: {
  count: number;
  warning: boolean;
  open: boolean;
  onToggle: () => void;
  controlsId: string;
  /** What the notes are about, for the tooltip: "these numbers", "these conflicts". */
  subject: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? `Hide notes about ${subject}` : `Show notes about ${subject} (${count})`}
      title={open ? `Hide notes about ${subject}` : `Show notes about ${subject}`}
      onClick={onToggle}
      className={cn(
        "relative flex size-8 items-center justify-center rounded-control border transition-colors",
        open ? "border-ink-4 bg-paper-2" : "border-line bg-paper hover:border-ink-4",
        warning ? "text-amber" : "text-ink-3"
      )}
    >
      <Info className="size-4" />
      {!open && (
        <span
          className={cn(
            "absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full font-mono text-[9px] font-semibold text-paper",
            warning ? "bg-amber" : "bg-ink-3"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
