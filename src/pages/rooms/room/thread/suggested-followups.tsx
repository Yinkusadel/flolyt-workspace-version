import * as React from "react";
import { Check, Copy, Lightbulb } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

/**
 * An agent reply's suggested follow-ups: a labelled list under the bubble. Clicking a row sends it as a new message into the
 * same thread; the copy icon puts the text on the clipboard instead. Same look as the chat panel's suggested-actions block
 * (own copy, so the chat panel is untouched), with long prompts held to two lines.
 */
export function SuggestedFollowUps({
  prompts,
  onSelect,
  canSend,
}: {
  prompts: { id: string; prompt: string }[];
  onSelect: (prompt: string) => void;
  canSend: boolean;
}) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  if (prompts.length === 0) return null;

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard");
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <div className="mt-2 overflow-hidden rounded-card border border-line bg-paper">
      <p className="flex items-center gap-2 border-b border-line px-3 py-2 text-[11.5px] font-semibold text-ink-3">
        <Lightbulb className="size-3.5 shrink-0 text-ink-4" />
        Suggested follow-ups
      </p>
      <ul>
        {prompts.map((item, index) => (
          <li key={item.id} className={cn("group flex items-start gap-2.5 pr-2 pl-3", index > 0 && "border-t border-line")}>
            <button
              type="button"
              disabled={!canSend}
              onClick={() => onSelect(item.prompt)}
              className="flex min-w-0 flex-1 items-start gap-2.5 py-2.5 text-left hover:text-ultra disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[10.5px] font-medium text-ink-3">
                {index + 1}
              </span>
              <span className="line-clamp-2 min-w-0 text-[12px] leading-snug text-ink">{item.prompt}</span>
            </button>
            <button
              type="button"
              aria-label="Copy this suggestion"
              onClick={() => copy(item.id, item.prompt)}
              className="mt-2 flex size-6 shrink-0 items-center justify-center rounded text-ink-4 transition-opacity hover:bg-paper-2 hover:text-ink [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
            >
              {copiedId === item.id ? <Check className="size-3.5 text-teal" /> : <Copy className="size-3.5" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
