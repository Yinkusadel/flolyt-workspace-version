import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface FilterMenuOption {
  value: string;
  label: string;
  /** Small tag after the label, e.g. "REC." */
  tag?: string;
}

/** Shared look for every control in the filter bar: label in muted text, value in ink. */
export const FILTER_CONTROL_CLASS =
  "flex h-9 shrink-0 items-center gap-1.5 rounded-panel border border-line bg-paper px-3 text-[12px] whitespace-nowrap text-ink outline-none transition-colors hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * A labelled single-select built on Popover with plain buttons. Deliberately not Radix Select: a
 * Select and a Popover-based control on the same page can leave the page stuck aria-hidden, and this
 * bar mixes both kinds of control.
 */
export function FilterMenu({
  label,
  valueLabel,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  valueLabel: string;
  options: FilterMenuOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" disabled={disabled} className={cn(FILTER_CONTROL_CLASS, "disabled:opacity-50")}>
          <span className="text-ink-3">{label}</span>
          <span className="font-medium">{valueLabel}</span>
          <ChevronDown className="size-3.5 text-ink-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-control px-2.5 py-1.5 text-left text-[12px] text-ink hover:bg-paper-2"
          >
            <span className="flex-1">{option.label}</span>
            {option.tag && (
              <span className="rounded-chip bg-teal-bg px-1 font-mono text-[8.5px] font-semibold text-teal uppercase">
                {option.tag}
              </span>
            )}
            {option.value === value && <Check className="size-3.5 text-ink" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
