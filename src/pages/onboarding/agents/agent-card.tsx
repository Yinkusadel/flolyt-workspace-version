import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { agentInitialsFromName } from "@/pages/rooms/format";
import type { WorkspaceAgentDto } from "@/services/api/workspace/get-workspace-agents";

type DisplayBucket = "ready" | "reading" | "partially_ready" | "unavailable" | "disabled" | "unprovisioned";

const STATE_META: Record<DisplayBucket, { label: string; dot: string; text: string }> = {
  ready: { label: "READY", dot: "bg-teal", text: "text-teal" },
  reading: { label: "READING", dot: "bg-amber", text: "text-amber" },
  partially_ready: { label: "PARTIAL", dot: "bg-amber", text: "text-amber" },
  unavailable: { label: "NOT READY", dot: "bg-ink-4", text: "text-ink-4" },
  // Intentional admin toggle — muted like "not ready", never alarming.
  disabled: { label: "DISABLED", dot: "bg-ink-4", text: "text-ink-4" },
  // An operator setup gap, not something the user chose — deliberately distinct from `disabled`
  // (rose, not muted ink-4) so it doesn't read as a toggle someone switched off.
  unprovisioned: { label: "SETUP NEEDED", dot: "bg-rose", text: "text-rose" },
};

// `detailedState` is the precise signal (it's the only field that can say "disabled" or
// "unprovisioned" — `state` can't express either). Falls back to the coarser `state` only for a
// payload recorded before `detailedState` existed.
function resolveBucket(agent: WorkspaceAgentDto): DisplayBucket {
  if (agent.detailedState in STATE_META) return agent.detailedState as DisplayBucket;
  if (agent.state === "reading") return "reading";
  if (agent.state === "ready") return "ready";
  return "unavailable";
}

function formatMeta(agent: WorkspaceAgentDto, bucket: DisplayBucket): string {
  if (bucket === "ready") {
    // Master Orchestrator reads no entities of its own — it's ready by definition, not by data.
    return agent.reads.length > 0 ? agent.reads.join(" · ") : "always on";
  }
  if (bucket === "reading") {
    return agent.moreDaysNeeded != null ? `needs ${agent.moreDaysNeeded} days` : "reading";
  }
  if (bucket === "unprovisioned") {
    // Never "connect X" here — this isn't a missing data source, it's workspace setup that
    // hasn't happened yet, so it shouldn't be phrased like something the user can fix by hand.
    return "workspace setup needed";
  }
  if (bucket === "disabled") {
    return agent.needs ? `connect ${agent.needs}` : "turned off";
  }
  // partially_ready, unavailable
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
  const bucket = resolveBucket(agent);
  const stateMeta = STATE_META[bucket];

  return (
    <div className="flex flex-col rounded-panel border border-dashed border-line bg-paper p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-dashed border-ultra-border font-mono text-[8px] font-semibold text-ultra">
          {agentInitialsFromName(agent.name)}
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
          title={formatMeta(agent, bucket)}
        >
          {formatMeta(agent, bucket)}
        </span>
      </div>
    </div>
  );
}
