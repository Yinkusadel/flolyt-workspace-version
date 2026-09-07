import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkspaceAgentDto } from "@/services/api/workspace/get-workspace-agents";

const STATE_META: Record<string, { label: string; dot: string; text: string }> = {
  ready: { label: "READY", dot: "bg-teal", text: "text-teal" },
  reading: { label: "READING", dot: "bg-amber", text: "text-amber" },
  not_ready: { label: "NOT READY", dot: "bg-ink-4", text: "text-ink-4" },
};

function formatMeta(agent: WorkspaceAgentDto): string {
  if (agent.state === "ready") {
    // Master Orchestrator reads no entities of its own — it's ready by definition, not by data.
    return agent.reads.length > 0 ? agent.reads.join(" · ") : "always on";
  }
  if (agent.state === "reading") {
    return agent.moreDaysNeeded != null ? `needs ${agent.moreDaysNeeded} days` : "reading";
  }
  return agent.needs ? `connect ${agent.needs}` : "not ready";
}

export function AgentCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-panel border border-dashed border-line bg-paper p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 shrink-0 rounded-full" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-7 w-full" />
      <div className="flex items-center justify-between border-t border-dashed border-line pt-3">
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-2.5 w-16" />
      </div>
    </div>
  );
}

export function AgentCard({ agent }: { agent: WorkspaceAgentDto }) {
  const stateMeta = STATE_META[agent.state] ?? STATE_META.not_ready;

  return (
    <div className="flex flex-col rounded-panel border border-dashed border-line bg-paper p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-dashed border-ultra-border font-mono text-[8px] font-semibold text-ultra">
          {agent.initials}
        </span>
        <span className="font-mono text-[9.5px] font-semibold tracking-[0.6px] text-ultra uppercase">
          {agent.name}
        </span>
      </div>

      <p className="mt-3 text-[10.5px] leading-snug text-ink-3">{agent.description}</p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-dashed border-line pt-3 pb-0">
        <span className="flex shrink-0 items-center gap-1.5">
          <span className={cn("size-1.5 shrink-0 rounded-full", stateMeta.dot)} />
          <span className={cn("font-mono text-[8.5px] font-semibold tracking-[0.6px]", stateMeta.text)}>
            {stateMeta.label}
          </span>
        </span>
        <span
          className="min-w-0 flex-1 truncate text-right font-mono text-[8.5px] text-ink-4"
          title={formatMeta(agent)}
        >
          {formatMeta(agent)}
        </span>
      </div>
    </div>
  );
}
