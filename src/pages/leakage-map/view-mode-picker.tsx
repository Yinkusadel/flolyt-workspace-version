import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { VIEW_MODE_OPTIONS, type ViewMode } from "@/pages/leakage-map/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ViewModePickerProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

/**
 * Gates whether WindowPicker renders at all (see index.tsx) — Window is a backward-looking period,
 * which Forward exposure has none of. Shade By is unaffected by this control either way.
 * Popover-based to match ShadeByPicker/WindowPicker on the same page — see
 * [[select_popover_aria_hidden_bug]] for why a plain `Select` can't sit next to them.
 */
export function ViewModePicker({ value, onChange }: ViewModePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = VIEW_MODE_OPTIONS.find((option) => option.value === value) ?? VIEW_MODE_OPTIONS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-auto items-center gap-2 rounded-panel border border-border bg-background px-2.5 py-2 text-[13px] whitespace-nowrap text-ink outline-none transition-colors hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span>
            <span className="text-ink-3">View </span>
            <span>{selected.shortLabel}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-1">
        {VIEW_MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
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
