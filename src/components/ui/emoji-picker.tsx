import { useMemo, useState } from "react";
import { Search, Smile } from "lucide-react";
import emojiGroups from "unicode-emoji-json/data-by-group.json";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EmojiEntry {
  emoji: string;
  name: string;
  slug: string;
}

interface EmojiGroup {
  name: string;
  slug: string;
  emojis: EmojiEntry[];
}

const EMOJI_GROUPS = emojiGroups as EmojiGroup[];
const ALL_EMOJIS = EMOJI_GROUPS.flatMap((group) => group.emojis);

function useFilteredGroups(query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EMOJI_GROUPS;
    const matches = ALL_EMOJIS.filter(
      (e) => e.name.includes(q) || e.slug.includes(q.replace(/\s+/g, "_"))
    );
    return matches.length > 0 ? [{ name: "Results", slug: "results", emojis: matches }] : [];
  }, [query]);
}

interface EmojiPickerButtonProps {
  onSelect: (emoji: string) => void;
  className?: string;
  "aria-label"?: string;
}

/** Drop-in replacement for a bare Smile icon button — same trigger footprint, adds a searchable
 * popover grid. Built on the existing Popover primitive rather than a full picker library — see
 * [[preact_radix_dialog_crash]] and [[searchable-select]]'s own reasoning for the same choice.
 * `unicode-emoji-json` supplies the real ~1,900-emoji dataset (plain JSON, no component code), so
 * only the UI shell here is bespoke. */
export function EmojiPickerButton({ onSelect, className, "aria-label": ariaLabel = "Emoji" }: EmojiPickerButtonProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const groups = useFilteredGroups(query);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn("shrink-0 text-ink-3 transition-colors hover:text-ultra", className)}
        >
          <Smile className="size-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" side="top" className="w-72 p-0">
        <div className="flex items-center gap-2 border-b border-line px-2.5 py-2">
          <Search className="size-3.5 shrink-0 text-ink-4" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search emoji…"
            className="w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-4"
          />
        </div>

        <div className="max-h-64 overflow-x-hidden overflow-y-auto p-2">
          {groups.length === 0 && (
            <p className="px-2.5 py-3 text-center text-[11.5px] text-ink-4">No emoji found</p>
          )}

          {groups.map((group) => (
            <div key={group.slug} className="mb-2 last:mb-0">
              <p className="px-1 pb-1 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
                {group.name}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {group.emojis.map((entry) => (
                  <button
                    key={entry.slug}
                    type="button"
                    title={entry.name}
                    onClick={() => handleSelect(entry.emoji)}
                    className="flex aspect-square w-full items-center justify-center rounded-control text-[16px] hover:bg-paper-2"
                  >
                    {entry.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
