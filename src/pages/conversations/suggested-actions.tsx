import { useState } from "react";
import { Check, Copy, Lightbulb, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export interface SuggestedAction {
  id: string;
  label: string;
}

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (label: string) => void;
}

export function SuggestedActions({ actions, isOpen, onOpenChange, onSelect }: SuggestedActionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!actions.length) return null;

  const copyAction = async (action: SuggestedAction) => {
    try {
      await navigator.clipboard.writeText(action.label);
      setCopiedId(action.id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId((current) => (current === action.id ? null : current)), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="mb-3 flex items-center gap-2 self-start rounded-full border border-line bg-paper-2 px-3.5 py-2 text-[11.5px] font-medium text-ink-3 shadow-xs transition-colors animate-in fade-in slide-in-from-bottom-1 hover:border-ink-4"
      >
        <Lightbulb className="size-3.5 shrink-0 text-ink-4" />
        Suggested Next Actions
        <Maximize2 className="size-3 shrink-0 text-ink-4" />
      </button>
    );
  }

  return (
    <div className="mb-3 overflow-hidden rounded-card border border-line bg-paper shadow-xs animate-in fade-in slide-in-from-bottom-1">
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <Lightbulb className="size-3.5 shrink-0 text-ink-4" />
        <span className="flex-1 text-[11.5px] font-semibold text-ink-3">Suggested Next Actions</span>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="flex size-5 shrink-0 items-center justify-center rounded text-ink-4 transition-colors hover:bg-paper-2 hover:text-ink"
        >
          <Minimize2 className="size-3.5" />
        </button>
      </div>

      <div className="border-t border-line">
        {actions.map((action, idx) => (
          <div
            key={action.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(action.label)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(action.label);
              }
            }}
            className={cn(
              "group flex w-full min-w-0 cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-paper-2",
              idx !== actions.length - 1 && "border-b border-line"
            )}
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[10.5px] font-medium text-ink-3">
              {idx + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-[12px] text-ink">{action.label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                copyAction(action);
              }}
              className="flex size-6 shrink-0 items-center justify-center rounded text-ink-4 opacity-0 transition-opacity hover:bg-paper hover:text-ink group-hover:opacity-100"
            >
              {copiedId === action.id ? <Check className="size-3.5 text-teal" /> : <Copy className="size-3.5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
