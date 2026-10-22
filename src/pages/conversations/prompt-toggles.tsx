import { Plus, ShieldQuestionMark, Sparkles, X, Zap, type LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const TOGGLE_CHIP_TONE_CLASSES: Record<"ultra" | "amber", string> = {
  ultra: "bg-ultra-bg text-ultra",
  amber: "bg-amber-bg text-amber",
};

// Mirrors a toggle in the "+" menu back into the toolbar as a standing chip once it's on — so
// its state stays visible without reopening the menu — and lets it be flipped off again in one
// click via the hover-revealed X, without touching the menu. The icon and the X share one
// tinted pill (rather than the X floating as a separate badge on top) and the X's width
// animates in from 0, in flow — so revealing it visibly pushes the next chip aside instead of
// overlapping it or popping in on top of it. No Radix Tooltip here: see
// preact_radix_dialog_crash memory on why Presence-based components misbehave under this
// repo's preact/compat setup; this is a dependency-free CSS group-hover tooltip instead.
function ToggleChip({
  icon: Icon,
  tone,
  label,
  onDismiss,
}: {
  icon: LucideIcon;
  tone: "ultra" | "amber";
  label: string;
  onDismiss: () => void;
}) {
  return (
    <div className="group/chip relative flex items-center">
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-[min(var(--radius-md),12px)]",
          TOGGLE_CHIP_TONE_CLASSES[tone]
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center">
          <Icon size={14} />
        </span>

        <button
          type="button"
          onClick={onDismiss}
          aria-label={`Turn off "${label}"`}
          className="flex size-7 max-w-0 shrink-0 items-center justify-center opacity-0 transition-all duration-200 ease-out group-hover/chip:max-w-7 group-hover/chip:opacity-100 hover:bg-black/10"
        >
          <X size={13} />
        </button>
      </div>

      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[11px] whitespace-nowrap text-paper opacity-0 shadow-lg transition-opacity group-hover/chip:opacity-100"
      >
        {label}
      </div>
    </div>
  );
}

// Shared "+" menu (Ask before spending / Plan mode / Enrichment chat) plus its toolbar chips —
// used by both the new-conversation composer and the in-conversation follow-up box, so the two
// promptboxes can't drift apart.
export function PromptToggles({
  askBeforeSpending,
  onAskBeforeSpendingChange,
  planMode,
  onPlanModeChange,
}: {
  askBeforeSpending: boolean;
  onAskBeforeSpendingChange: (value: boolean) => void;
  planMode: boolean;
  onPlanModeChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          aria-label="Prompt settings"
        >
          <Plus size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="justify-between">
            <span className="flex items-center gap-2">
              <ShieldQuestionMark size={14} className="text-ink-3" />
              Ask before spending
            </span>
            <Switch checked={askBeforeSpending} onCheckedChange={onAskBeforeSpendingChange} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="justify-between">
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-ink-3" />
              Plan mode
            </span>
            <Switch
              checked={planMode}
              onCheckedChange={onPlanModeChange}
              className="data-[state=checked]:bg-amber"
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Sparkles size={14} className="text-ink-3" />
            Enrichment chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {askBeforeSpending && (
        <ToggleChip
          icon={ShieldQuestionMark}
          tone="ultra"
          label="Asks before spending credits"
          onDismiss={() => onAskBeforeSpendingChange(false)}
        />
      )}
      {planMode && (
        <ToggleChip
          icon={Zap}
          tone="amber"
          label="Plans before acting"
          onDismiss={() => onPlanModeChange(false)}
        />
      )}
    </div>
  );
}
