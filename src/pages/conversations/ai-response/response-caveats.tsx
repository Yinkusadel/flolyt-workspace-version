import { Info } from "lucide-react";
import type { AgentResponseV2 } from "@/features/ai-conversations/agent-response-types";

export function AiResponseCaveats({ caveats }: { caveats: AgentResponseV2["caveats"] }) {
  if (!caveats.length) return null;

  return (
    <div className="flex w-full max-w-[85%] min-w-0 flex-col gap-1.5">
      {caveats.map((caveat) => (
        <div
          key={caveat.code}
          className="flex min-w-0 items-start gap-2 rounded-card border border-amber-border bg-amber-bg px-3 py-2"
        >
          <Info className="mt-0.5 size-3.5 shrink-0 text-amber" />
          <p className="min-w-0 text-[11px] leading-relaxed wrap-break-word text-amber">
            {caveat.message}
          </p>
        </div>
      ))}
    </div>
  );
}
