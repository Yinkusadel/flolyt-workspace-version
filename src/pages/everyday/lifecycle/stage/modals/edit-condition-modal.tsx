import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableSelect, SearchableSelectSkeleton, type SearchableSelectOption } from "@/components/ui/searchable-select";
import { BacktestPreview } from "@/pages/everyday/lifecycle/stage/modals/backtest-preview";
import useUpdateCondition from "@/features/lifecycle/use-update-condition";
import useDecideCondition from "@/features/lifecycle/use-decide-condition";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useGetWatchableMetrics } from "@/features/lifecycle/use-get-watchable-metrics";
import type { StageAgentConditionDto } from "@/services/api/lifecycle/get-stage-agents";

const NO_ROUTE_OVERRIDE = "__stage_routing_chain__";

/**
 * Shared threshold/sustain/routing fields for both editing a `watching`/`muted` condition
 * (`PUT /lifecycle/conditions/{id}`) and accepting an agent-proposed one with changes
 * (`POST /lifecycle/conditions/{id}/decide`). Metric, comparison, label and segment aren't
 * editable through either endpoint — only threshold, sustain window and routing ever move.
 */
function ConditionFields({
  condition,
  threshold,
  onThresholdChange,
  sustainReadings,
  onSustainReadingsChange,
  routesToUserId,
  onRoutesToUserIdChange,
  stageKey,
}: {
  condition: StageAgentConditionDto;
  threshold: number;
  onThresholdChange: (value: number) => void;
  sustainReadings: number;
  onSustainReadingsChange: (value: number) => void;
  routesToUserId: string | null;
  onRoutesToUserIdChange: (value: string | null) => void;
  stageKey: string;
}) {
  const { members, isLoading: membersLoading } = useGetWorkspaceMembers();
  const { data: metricsData, isLoading: metricsLoading } = useGetWatchableMetrics();
  const metric = metricsData?.data.find((m) => m.key === condition.metricKey);

  const routeOptions: SearchableSelectOption[] = [
    { value: NO_ROUTE_OVERRIDE, label: "Stage's own routing chain (default)" },
    ...members
      .filter((m) => m.kind === "Human" && m.isActive)
      .map((m) => ({ value: m.id, label: m.email ? `${m.displayName} · ${m.email}` : m.displayName })),
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-panel border border-line bg-paper px-3.5 py-2.5">
        <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Condition</p>
        <p className="mt-1.5 text-[12px] font-semibold text-ink">{condition.label}</p>
        <p className="mt-0.5 font-mono text-[9.5px] text-ink-4">
          {condition.comparison} · {condition.metricQuestion}
          {condition.segment ? ` · ${condition.segment}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Threshold</label>
          <div className="mt-1.5 flex items-center gap-2">
            <Input
              type="number"
              value={Number.isFinite(threshold) ? threshold : ""}
              onChange={(e) => onThresholdChange(e.currentTarget.valueAsNumber)}
            />
            {condition.unit && <span className="shrink-0 text-[10.5px] text-ink-4">{condition.unit === "percent" ? "%" : condition.unit}</span>}
          </div>
        </div>
        <div>
          <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Sustained for</label>
          <Input
            type="number"
            min={1}
            step={1}
            className="mt-1.5"
            value={Number.isFinite(sustainReadings) ? sustainReadings : ""}
            onChange={(e) => onSustainReadingsChange(Math.max(1, Math.round(e.currentTarget.valueAsNumber || 1)))}
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Opens a room for</label>
        {membersLoading ? (
          <SearchableSelectSkeleton className="mt-1.5" />
        ) : (
          <SearchableSelect
            className="mt-1.5"
            options={routeOptions}
            value={routesToUserId ?? NO_ROUTE_OVERRIDE}
            onChange={(value) => onRoutesToUserIdChange(value === NO_ROUTE_OVERRIDE ? null : value)}
          />
        )}
      </div>

      <BacktestPreview
        stageKey={stageKey}
        metricKey={condition.metricKey}
        comparison={condition.comparison as "AtOrBelow" | "AtOrAbove"}
        threshold={threshold}
        sustainReadings={sustainReadings}
        segment={condition.segment}
        hasHistory={metricsLoading ? null : (metric?.hasHistory ?? null)}
      />
    </div>
  );
}

/** Edits a `watching` or `muted` condition's threshold/sustain/routing — refused server-side on a still-`proposed` one. */
export function EditConditionModal({
  stageKey,
  condition,
  open,
  onOpenChange,
}: {
  stageKey: string;
  condition: StageAgentConditionDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [threshold, setThreshold] = useState(0);
  const [sustainReadings, setSustainReadings] = useState(1);
  const [routesToUserId, setRoutesToUserId] = useState<string | null>(null);
  const { updateCondition, isPending } = useUpdateCondition({ onSuccess: () => onOpenChange(false) });

  useEffect(() => {
    if (condition) {
      setThreshold(condition.threshold);
      setSustainReadings(condition.sustainReadings);
      setRoutesToUserId(null);
    }
  }, [condition]);

  const submit = () => {
    if (!condition) return;
    updateCondition({ conditionId: condition.id, threshold, sustainReadings, routesToUserId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit condition</DialogTitle>
          <DialogDescription>Moves the threshold, sustain window, or routing on an existing condition.</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          {condition && (
            <ConditionFields
              condition={condition}
              threshold={threshold}
              onThresholdChange={setThreshold}
              sustainReadings={sustainReadings}
              onSustainReadingsChange={setSustainReadings}
              routesToUserId={routesToUserId}
              onRoutesToUserIdChange={setRoutesToUserId}
              stageKey={stageKey}
            />
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={isPending || !condition}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Accepts a `proposed` condition, optionally adjusting threshold/sustain/routing in the same call. */
export function AcceptConditionModal({
  stageKey,
  condition,
  open,
  onOpenChange,
}: {
  stageKey: string;
  condition: StageAgentConditionDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [threshold, setThreshold] = useState(0);
  const [sustainReadings, setSustainReadings] = useState(1);
  const [routesToUserId, setRoutesToUserId] = useState<string | null>(null);
  const { decideCondition, isPending } = useDecideCondition({ onSuccess: () => onOpenChange(false) });

  useEffect(() => {
    if (condition) {
      setThreshold(condition.threshold);
      setSustainReadings(condition.sustainReadings);
      setRoutesToUserId(null);
    }
  }, [condition]);

  const submit = () => {
    if (!condition) return;
    decideCondition({ conditionId: condition.id, accept: true, threshold, sustainReadings, routesToUserId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Accept proposed condition</DialogTitle>
          <DialogDescription>An agent proposed this — adjust it before accepting, or accept as proposed.</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          {condition && (
            <ConditionFields
              condition={condition}
              threshold={threshold}
              onThresholdChange={setThreshold}
              sustainReadings={sustainReadings}
              onSustainReadingsChange={setSustainReadings}
              routesToUserId={routesToUserId}
              onRoutesToUserIdChange={setRoutesToUserId}
              stageKey={stageKey}
            />
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={isPending || !condition}>
              {isPending ? "Accepting…" : "Accept"}
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
