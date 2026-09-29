import { useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

export interface SearchableSelectOption {
  value: string;
  label: string;
  /** A flag icon or similar short leading glyph — purely decorative. */
  icon?: ReactNode;
  /** Optional section header to cluster options under (e.g. a source category). Omit for a flat list. */
  group?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-invalid"?: boolean;
}

// Comfortably above the ~250-country list (the largest unfiltered case), so it
// never silently truncates a real, useful list — only a guard against genuinely
// huge unfiltered ones (some countries have thousands of cities).
const MAX_VISIBLE_RESULTS = 500;

/**
 * Type-to-filter dropdown, built on the existing Popover primitive rather than
 * a combobox library — see [[preact_radix_dialog_crash]]. Always mounted with
 * `open` starting false (its own internal state), never gated behind a truthy
 * conditional on first render.
 */
export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results",
  disabled = false,
  id,
  className,
  "aria-invalid": ariaInvalid,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const filtered = matches.slice(0, MAX_VISIBLE_RESULTS);
  const truncatedCount = matches.length - filtered.length;

  const groups = useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, SearchableSelectOption[]>();
    for (const option of filtered) {
      const key = option.group ?? "";
      if (!byGroup.has(key)) {
        order.push(key);
        byGroup.set(key, []);
      }
      byGroup.get(key)!.push(option);
    }
    return order.map((key) => ({ label: key, options: byGroup.get(key)! }));
  }, [filtered]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2 rounded-panel border border-border bg-paper-2 px-2.5 text-[12.5px] text-ink outline-none transition-colors",
            "hover:border-ink-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={cn("flex min-w-0 items-center gap-1.5 truncate", !selected && "text-ink-4")}>
            {selected?.icon && <span>{selected.icon}</span>}
            <span className="truncate">{selected ? selected.label : placeholder}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <div className="flex items-center gap-2 border-b border-line px-2.5 py-2">
          <Search className="size-3.5 shrink-0 text-ink-4" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-4"
          />
        </div>

        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <p className="px-2.5 py-3 text-center text-[11.5px] text-ink-4">{emptyText}</p>
          )}

          {groups.map((group, i) => (
            <div key={group.label || "__ungrouped"} className={cn(i > 0 && group.label && "mt-1 border-t border-line pt-1")}>
              {group.label && (
                <p className="sticky top-0 z-10 bg-paper px-2.5 pt-1.5 pb-1 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                  {group.label}
                </p>
              )}
              {group.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    handleOpenChange(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-control px-2.5 py-1.75 text-left text-[12.5px] text-ink hover:bg-paper-2"
                >
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {option.value === value && <Check className="size-3.5 shrink-0 text-ultra" />}
                </button>
              ))}
            </div>
          ))}

          {truncatedCount > 0 && (
            <p className="px-2.5 py-2 text-center text-[10.5px] text-ink-4">
              {truncatedCount} more — keep typing to narrow it down
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Same footprint as the real trigger button, shown in its place while the
 * options a select depends on are still loading — never render the real
 * (empty-options) select mid-fetch, it reads as broken rather than loading.
 */
export function SearchableSelectSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-panel border border-border bg-paper-2 px-2.5",
        className
      )}
    >
      <Skeleton className="h-3 w-28" />
      <ChevronDown className="size-3.5 shrink-0 text-ink-4/40" />
    </div>
  );
}
