import { Button } from "@/components/ui/button";
import { Sparkline } from "@/pages/everyday/lifecycle/stage/sparkline";
import useBacktestStageCondition from "@/features/lifecycle/use-backtest-stage-condition";

/**
 * "How often would this have fired?" — POST /lifecycle/stages/{stageKey}/conditions/backtest,
 * shared by the create and edit/accept condition modals so a person previews against the exact
 * draft values before saving, replacing the old static mock "simulation" text. Only available for
 * metrics with a stored monthly series (`hasHistory`) — a current-state metric returns `firings:
 * null` naming why, rendered as a caveat rather than a fake simulated count.
 */
export function BacktestPreview({
  stageKey,
  metricKey,
  comparison,
  threshold,
  sustainReadings,
  segment,
  hasHistory,
}: {
  stageKey: string;
  metricKey: string | null;
  comparison: "AtOrBelow" | "AtOrAbove";
  threshold: number;
  sustainReadings: number;
  segment?: string | null;
  hasHistory: boolean | null;
}) {
  const { backtest, backtestResult, isPending } = useBacktestStageCondition();

  const canSimulate = !!metricKey && Number.isFinite(threshold) && sustainReadings > 0 && hasHistory !== false;

  const run = () => {
    if (!metricKey || !canSimulate) return;
    backtest({ stageKey, metricKey, comparison, threshold, sustainReadings, segment: segment ?? null });
  };

  return (
    <div className="rounded-card border border-ultra-border bg-ultra-bg">
      <div className="space-y-2.5 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold text-ink">How often would this have fired?</p>
          <Button type="button" size="sm" variant="outline" onClick={run} disabled={!canSimulate || isPending}>
            {isPending ? "Simulating…" : "Simulate"}
          </Button>
        </div>

        {hasHistory === false && (
          <p className="text-[10.5px] text-ink-4">
            This metric has no stored history, so a live sustain window can't be simulated ahead of time.
          </p>
        )}

        {backtestResult &&
          (backtestResult.firings === null ? (
            <p className="text-[10.5px] text-ink-4">{backtestResult.caveat ?? "Not available for this metric."}</p>
          ) : (
            <>
              <p className="font-mono text-[10px] font-semibold text-ink-4">
                Would have fired {backtestResult.firings} time{backtestResult.firings === 1 ? "" : "s"}
                {backtestResult.grain ? ` · by ${backtestResult.grain}` : ""}
              </p>
              <Sparkline
                series={[
                  {
                    points: backtestResult.points.map((p, index) => ({ x: index, y: p.reading })),
                    toneClass: "stroke-ultra",
                  },
                ]}
                referenceLines={[{ y: threshold, toneClass: "stroke-amber" }]}
                width={240}
                height={40}
              />
              {backtestResult.caveat && <p className="text-[9.5px] leading-relaxed text-ink-4">{backtestResult.caveat}</p>}
            </>
          ))}
      </div>
    </div>
  );
}
