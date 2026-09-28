import { Sparkles } from "lucide-react";
import type { AgentFollowUpPromptV2 } from "@/features/ai-conversations/agent-response-types";

interface AiFollowUpPromptsProps {
  prompts: AgentFollowUpPromptV2[];
  onSelect: (prompt: string) => void;
}

// Real backend-generated follow-ups — replaces the old hardcoded MOCK_SUGGESTED_ACTIONS panel.
// Selecting one sends its text unchanged as the next message (per the handoff doc: not a governed
// action, not steering), so these get a quieter, neutral chip style deliberately distinct from
// AiResponseActions' ultra-accent buttons, which represent an actual consequential action (e.g.
// opening a room) rather than just "ask this next."
export function AiFollowUpPrompts({ prompts, onSelect }: AiFollowUpPromptsProps) {
  if (!prompts.length) return null;

  return (
    <div className="flex w-full max-w-[85%] min-w-0 flex-wrap gap-2">
      {prompts.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.prompt)}
          className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-paper px-3 py-1.5 text-[11.5px] font-medium text-ink-3 transition-colors hover:border-ink-4 hover:text-ink"
        >
          <Sparkles className="size-3 shrink-0 text-ink-4" />
          {item.prompt}
        </button>
      ))}
    </div>
  );
}
