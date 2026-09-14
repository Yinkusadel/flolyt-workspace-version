import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ThresholdOption<T> = { value: T; label: string; note: string };

/** Shared shape for the Severity and Confidence controls — both are "≥ X" minimum-threshold
 * filters (hide cells below the bar), not shading choices, so one generic list serves both. */
export function ThresholdPicker<T extends string | number>({
  prefix,
  options,
  value,
  onChange,
}: {
  prefix: string;
  options: ThresholdOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-auto items-center gap-2 rounded-panel border border-border bg-background px-2.5 py-2 text-[13px] whitespace-nowrap text-ink outline-none transition-colors hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span>
            <span className="text-ink-3">{prefix} </span>
            <span>{selected.label}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-60 p-1">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left hover:bg-paper-2"
          >
            <span className="block flex-1">
              <span className="block text-[12px] font-medium text-ink">{option.label}</span>
              <span className="block text-[10.5px] text-ink-3">{option.note}</span>
            </span>
            {option.value === value && <Check className="size-3.5 shrink-0 text-ultra" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
