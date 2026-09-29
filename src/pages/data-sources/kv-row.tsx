import { cn } from "@/lib/utils";
import type { ChipTone } from "@/components/ui/chip";

/** Label-left / value-right row used inside a connection's expanded detail panel. */
export function KvRow({ label, value, tone }: { label: string; value: string; tone?: ChipTone }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-[10.5px] text-ink-3">{label}</span>
      <span
        className={cn(
          "font-mono text-[10.5px] sm:text-right",
          tone === "rose" ? "text-rose" : "text-ink-2"
        )}
      >
        {value}
      </span>
    </div>
  );
}
