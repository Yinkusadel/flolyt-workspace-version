import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import { FILTER_CONTROL_CLASS } from "@/pages/leakage-map/filter-menu";
import { countMoreFilters, type LeakageFilters } from "@/pages/leakage-map/filters";
import { humanizeEnum } from "@/pages/leakage-map/format";

type MoreFilterKey = "sector" | "severity" | "confidence" | "lifecycleClass";

/**
 * Sector, severity, confidence and lifecycle class. Plain toggle buttons inside the Popover (no nested
 * Select), and clicking the active option clears it. Option lists are the server's own `controls`
 * vocabularies; only the display text is formatted here.
 */
export function MoreFilters({
  controls,
  filters,
  onChange,
  onClear,
}: {
  controls: LeakageV2Controls;
  filters: LeakageFilters;
  onChange: (patch: Partial<Pick<LeakageFilters, MoreFilterKey>>) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = countMoreFilters(filters);

  const groups: { key: MoreFilterKey; title: string; options: string[]; format: (v: string) => string }[] = [
    { key: "sector", title: "Sector", options: controls.sectors, format: humanizeEnum },
    { key: "severity", title: "Severity", options: controls.severities, format: (v) => v.toUpperCase() },
    { key: "confidence", title: "Confidence", options: controls.confidenceLevels, format: humanizeEnum },
    { key: "lifecycleClass", title: "Lifecycle", options: controls.lifecycleClasses, format: humanizeEnum },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={FILTER_CONTROL_CLASS}>
          <SlidersHorizontal className="size-3.5 text-ink-3" />
          <span className="text-ink-3">More filters</span>
          <span className="rounded-chip bg-paper-2 px-1.5 font-mono text-[10px] font-semibold">{activeCount}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-3">
        <div className="space-y-3">
          {groups
            .filter((g) => g.options.length > 0)
            .map((group) => (
              <div key={group.key}>
                <p className="mb-1.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((option) => {
                    const active = filters[group.key] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange({ [group.key]: active ? null : option })}
                        className={cn(
                          "rounded-control border px-2 py-1 text-[11.5px] transition-colors",
                          active
                            ? "border-ink bg-ink text-paper"
                            : "border-line bg-paper text-ink-2 hover:border-ink-4 hover:text-ink"
                        )}
                      >
                        {group.format(option)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
        <div className="mt-3 flex justify-end border-t border-line pt-2.5">
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className="text-[11.5px] text-ink-3 hover:text-ink disabled:opacity-40"
          >
            Clear filters
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
