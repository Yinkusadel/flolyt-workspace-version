import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { SetThresholdModal, type ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import { formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetStageAgents } from "@/features/lifecycle/use-get-stage-agents";
import type { StageAgentConditionDto, StageAgentDto } from "@/services/api/lifecycle/get-stage-agents";
import { ACQUIRE_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/acquire/data";
import { ACTIVATE_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/activate/data";
import { PRICE_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/price/data";
import { ADOPT_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/adopt/data";
import { RETAIN_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/retain/data";
import { EXPAND_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/expand/data";
import { SUPPORT_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/support/data";
import { RENEW_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/renew/data";
import { ADVOCATE_ASSIGN_OWNER_PRESET, ADVOCATE_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/advocate/data";
import { CHURN_ASSIGN_OWNER_PRESET, CHURN_THRESHOLD_PRESET } from "@/pages/everyday/lifecycle/stage/churn/data";
import { AssignAnOwnerModal, type AssignOwnerPreset } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";
import { createPortal } from "react-dom";

// The "Add a threshold" preview dialog (condition/byMoreThan/sustainedFor/segmentedBy/routesTo/
// simulation) is a static design mock, not backed by a live backtest — POST /lifecycle/stages/
// {stageKey}/conditions/backtest would be the real endpoint for that preview and is out of scope
// here. Kept per-stage so the dialog still shows plausible, stage-specific example copy.
const THRESHOLD_PRESET: Record<string, ThresholdPreset> = {
  acquire: ACQUIRE_THRESHOLD_PRESET,
  activate: ACTIVATE_THRESHOLD_PRESET,
  price: PRICE_THRESHOLD_PRESET,
  adopt: ADOPT_THRESHOLD_PRESET,
  retain: RETAIN_THRESHOLD_PRESET,
  expand: EXPAND_THRESHOLD_PRESET,
  support: SUPPORT_THRESHOLD_PRESET,
  renew: RENEW_THRESHOLD_PRESET,
  advocate: ADVOCATE_THRESHOLD_PRESET,
  churn: CHURN_THRESHOLD_PRESET,
};

// Advocate and Churn have no stage owner in the mock data, so their Agents tab keeps the
// "Assign an owner" header action — unrelated to the live conditions table above.
const ASSIGN_OWNER_PRESET: Partial<Record<string, AssignOwnerPreset>> = {
  advocate: ADVOCATE_ASSIGN_OWNER_PRESET,
  churn: CHURN_ASSIGN_OWNER_PRESET,
};

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

const READINESS_LABEL: Record<string, string> = { ready: "ready", reading: "reading", "not-ready": "not ready" };
const READINESS_TONE: Record<string, ChipTone> = { ready: "teal", reading: "amber", "not-ready": "neutral" };

function thresholdText(condition: StageAgentConditionDto): string {
  const unitSuffix = condition.unit === "percent" ? "%" : ` ${condition.unit}`;
  const parts = [`${condition.comparison} ${condition.threshold}${unitSuffix}`];
  if (condition.segment) parts.push(condition.segment);
  if (condition.sustainReadings > 1) parts.push(`sustained ${condition.sustainReadings}×`);
  return parts.join(" · ");
}

type ConditionRow = { id: string; agentName: string; condition: StageAgentConditionDto };

const COLUMNS: Column<ConditionRow>[] = [
  { key: "agent", header: "Agent", render: (row) => <span className="text-ink-3">{row.agentName}</span> },
  { key: "condition", header: "Condition", render: (row) => <span className="font-semibold text-ink-2">{row.condition.label}</span> },
  { key: "threshold", header: "Threshold", align: "right", render: (row) => <span className="font-mono text-ink-4">{thresholdText(row.condition)}</span> },
  {
    key: "status",
    header: "Status",
    align: "right",
    render: (row) => <Chip tone="neutral">{row.condition.status}</Chip>,
  },
];

function AgentsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-2.5 rounded-card border border-line bg-paper p-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

/** The shared Agents tab template (e.g. A10) — which agents watch this stage, and what would make one open a room. */
export function AgentsTab() {
  const { stage, headerActionsEl } = useStageContext();
  const { data, isLoading, isError, refetch } = useGetStageAgents(stage.slug);
  const agentsData = data?.data;
  const agents: StageAgentDto[] = agentsData?.agents ?? [];
  const conditionRows: ConditionRow[] = agents.flatMap((agent) =>
    agent.conditions.map((condition) => ({ id: `${agent.key}::${condition.id}`, agentName: agent.name, condition }))
  );
  const [thresholdOpen, setThresholdOpen] = useState(false);
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false);
  const assignOwnerPreset = ASSIGN_OWNER_PRESET[stage.slug];

  return (
    <div className="space-y-8">
      {assignOwnerPreset &&
        headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setAssignOwnerOpen(true)}>
            Assign an owner
          </Button>,
          headerActionsEl
        )}

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Agents watching this stage{agents.length > 0 ? ` · ${agents.length}` : ""}
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load this stage's agents.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <AgentsSkeleton />
        ) : agents.length === 0 ? (
          <div className="rounded-card border border-line bg-paper px-4 py-10 text-center">
            <p className="text-[12px] font-semibold text-ink">No agent watches this stage yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.key} className="rounded-card border border-line bg-paper">
                <div className="space-y-2.5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PersonAvatar kind="agent" initials={agent.initials} size="sm" />
                      <span className="font-mono text-[9.5px] font-medium text-ink-4">{agent.role}</span>
                    </div>
                    <Chip tone={READINESS_TONE[agent.readiness] ?? "neutral"}>{READINESS_LABEL[agent.readiness] ?? agent.readiness}</Chip>
                  </div>
                  <h3 className="text-[13px] font-semibold text-ink">{agent.name}</h3>
                  {agent.reads.length > 0 && <p className="text-[10.5px] leading-relaxed text-ink-3">Reads: {agent.reads.join(", ")}</p>}
                  {agent.readiness !== "ready" && (agent.needs || agent.wouldUnlock) ? (
                    <div className="flex items-center gap-2 border-t border-line pt-2.5">
                      <InfoTooltip missingSource={agent.needs ?? undefined} wouldUnlock={agent.wouldUnlock ?? undefined} />
                      <span className="font-mono text-[10px] font-semibold text-ink-4">not fully ready</span>
                    </div>
                  ) : (
                    <p className="border-t border-line pt-2.5 font-mono text-[10px] font-semibold text-ink-4">
                      watching {agent.conditions.length} condition{agent.conditions.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            What would make an agent open a room here
          </p>
          <Button type="button" size="sm" className="shrink-0" onClick={() => setThresholdOpen(true)}>
            Add a threshold
          </Button>
        </div>
        {/* Dropped "Currently" and "Who it goes to" — the condition object's real shape is marked
            truncated in the spec (it has additional undocumented properties), and neither a live
            reading nor a resolved owner name is among the fields actually documented. The
            resolved routing chain (stage owner → team lead → triage admin) is prose in the
            endpoint's notes, not a field on the condition itself — confirm against a real
            response before adding either column back. */}
        {!isLoading && !isError && (
          <DataTable
            columns={COLUMNS}
            rows={conditionRows}
            emptyTitle="No thresholds set for this stage yet"
            emptyBody="Conditions that would make an agent open a room here will appear once one is added."
          />
        )}
      </section>

      {agentsData && agentsData.recentFirings.length > 0 && (
        <section className="space-y-2">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Recent firings</p>
          <div className="space-y-1.5 rounded-card border border-line bg-paper p-4">
            {agentsData.recentFirings.map((firing) => (
              <div key={firing.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <span className="text-[10.5px] text-ink-2">
                  {firing.label} <span className="text-ink-4">· {formatShortDate(firing.firedAtUtc)}</span>
                </span>
                <span className="font-mono text-[10px] text-ink-4">
                  {firing.reading} vs {firing.threshold} · {firing.outcome} · routed via {firing.routedVia}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {agentsData?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <SetThresholdModal
        stageName={stage.name}
        preset={THRESHOLD_PRESET[stage.slug] ?? ACQUIRE_THRESHOLD_PRESET}
        open={thresholdOpen}
        onOpenChange={setThresholdOpen}
      />
      {assignOwnerPreset && (
        <AssignAnOwnerModal preset={assignOwnerPreset} open={assignOwnerOpen} onOpenChange={setAssignOwnerOpen} />
      )}
    </div>
  );
}
