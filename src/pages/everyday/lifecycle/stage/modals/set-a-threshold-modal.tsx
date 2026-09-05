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
import useCreateStageCondition from "@/features/lifecycle/use-create-stage-condition";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useGetWatchableMetrics } from "@/features/lifecycle/use-get-watchable-metrics";
import type { StageAgentDto } from "@/services/api/lifecycle/get-stage-agents";

const NO_ROUTE_OVERRIDE = "__stage_routing_chain__";
const NO_AGENT = "__no_agent__";

const COMPARISON_OPTIONS: SearchableSelectOption[] = [
  { value: "AtOrBelow", label: "At or below the threshold" },
  { value: "AtOrAbove", label: "At or above the threshold" },
];

/** A11 — "set a threshold" modal, shared by every stage's Agents tab. Creates a real condition via POST /lifecycle/stages/{stageKey}/conditions. */
export function SetThresholdModal({
  stageKey,
  stageName,
  agents,
  open,
  onOpenChange,
}: {
  stageKey: string;
  stageName: string;
  agents: StageAgentDto[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [label, setLabel] = useState("");
  const [metricKey, setMetricKey] = useState<string | null>(null);
  const [comparison, setComparison] = useState<"AtOrBelow" | "AtOrAbove">("AtOrBelow");
  const [threshold, setThreshold] = useState<number>(NaN);
  const [sustainReadings, setSustainReadings] = useState(1);
  const [segment, setSegment] = useState("");
  const [agentKey, setAgentKey] = useState<string | null>(null);
  const [routesToUserId, setRoutesToUserId] = useState<string | null>(null);

  const { members, isLoading: membersLoading } = useGetWorkspaceMembers();
  const { data: metricsData, isLoading: metricsLoading } = useGetWatchableMetrics();
  const metrics = metricsData?.data ?? [];
  const selectedMetric = metrics.find((m) => m.key === metricKey) ?? null;

  const { createCondition, isPending } = useCreateStageCondition({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      setLabel("");
      setMetricKey(null);
      setComparison("AtOrBelow");
      setThreshold(NaN);
      setSustainReadings(1);
      setSegment("");
      setAgentKey(null);
      setRoutesToUserId(null);
    }
  }, [open]);

  const metricOptions: SearchableSelectOption[] = metrics.map((m) => ({ value: m.key, label: m.question }));
  const agentOptions: SearchableSelectOption[] = [
    { value: NO_AGENT, label: "Not agent-specific" },
    ...agents.map((a) => ({ value: a.key, label: a.name })),
  ];
  const routeOptions: SearchableSelectOption[] = [
    { value: NO_ROUTE_OVERRIDE, label: "Stage's own routing chain (default)" },
    ...members
      .filter((m) => m.kind === "Human" && m.isActive)
      .map((m) => ({ value: m.id, label: m.email ? `${m.displayName} · ${m.email}` : m.displayName })),
  ];

  const canSubmit = !!label.trim() && !!metricKey && Number.isFinite(threshold) && sustainReadings > 0;

  const submit = () => {
    if (!canSubmit || !metricKey) return;
    createCondition({
      stageKey,
      label: label.trim(),
      metricKey,
      comparison,
      threshold,
      sustainReadings,
      agentKey,
      routesToUserId,
      segment: selectedMetric?.needsSegmentation ? segment.trim() || null : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New threshold</DialogTitle>
          <DialogDescription>What should make an agent open a room in {stageName}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Label</label>
            <Input
              className="mt-1.5"
              placeholder="e.g. Repeat rate drops sharply"
              value={label}
              onChange={(e) => setLabel(e.currentTarget.value)}
            />
          </div>

          <div>
            <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Watch</label>
            {metricsLoading ? (
              <SearchableSelectSkeleton className="mt-1.5" />
            ) : (
              <SearchableSelect
                className="mt-1.5"
                options={metricOptions}
                value={metricKey}
                onChange={setMetricKey}
                placeholder="Pick a metric…"
                emptyText="No watchable metrics"
              />
            )}
          </div>

          <div>
            <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Condition</label>
            <SearchableSelect className="mt-1.5" options={COMPARISON_OPTIONS} value={comparison} onChange={(v) => setComparison(v as "AtOrBelow" | "AtOrAbove")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">By more than</label>
              <div className="mt-1.5 flex items-center gap-2">
                <Input
                  type="number"
                  value={Number.isFinite(threshold) ? threshold : ""}
                  onChange={(e) => setThreshold(e.currentTarget.valueAsNumber)}
                />
                {selectedMetric?.unit && (
                  <span className="shrink-0 text-[10.5px] text-ink-4">{selectedMetric.unit === "percent" ? "%" : selectedMetric.unit}</span>
                )}
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
                onChange={(e) => setSustainReadings(Math.max(1, Math.round(e.currentTarget.valueAsNumber || 1)))}
              />
            </div>
          </div>

          {selectedMetric?.needsSegmentation && (
            <div>
              <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Segmented by</label>
              <Input
                className="mt-1.5"
                placeholder="e.g. a departure, or a currency"
                value={segment}
                onChange={(e) => setSegment(e.currentTarget.value)}
              />
              <p className="mt-1 text-[9.5px] text-ink-4">This metric is meaningless unsliced — name what to slice it by.</p>
            </div>
          )}

          <div>
            <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Agent</label>
            <SearchableSelect
              className="mt-1.5"
              options={agentOptions}
              value={agentKey ?? NO_AGENT}
              onChange={(v) => setAgentKey(v === NO_AGENT ? null : v)}
            />
          </div>

          <div>
            <label className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">And opens a room for</label>
            {membersLoading ? (
              <SearchableSelectSkeleton className="mt-1.5" />
            ) : (
              <SearchableSelect
                className="mt-1.5"
                options={routeOptions}
                value={routesToUserId ?? NO_ROUTE_OVERRIDE}
                onChange={(v) => setRoutesToUserId(v === NO_ROUTE_OVERRIDE ? null : v)}
              />
            )}
          </div>

          <BacktestPreview
            stageKey={stageKey}
            metricKey={metricKey}
            comparison={comparison}
            threshold={threshold}
            sustainReadings={sustainReadings}
            segment={segment || null}
            hasHistory={selectedMetric ? selectedMetric.hasHistory : null}
          />
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={!canSubmit || isPending}>
              {isPending ? "Adding…" : "Add the threshold"}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
