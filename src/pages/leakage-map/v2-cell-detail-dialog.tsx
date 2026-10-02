import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney, formatCount, formatPercent, formatRelativeTime, formatShortDateWithYear } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import { useGetLeakageCellV2 } from "@/features/leakage/use-get-leakage-cell-v2";
import type { GetLeakageCellV2Params } from "@/services/api/leakage/get-leakage-cell-v2";
import type { LeakageV2Cell } from "@/services/api/leakage/get-leakage";

function DetailSkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

/**
 * The cell-detail dialog's content — a quick-glance view, restored 2026-10-02 alongside the fuller
 * `V2CellEvidenceSheetContent` (which briefly replaced it outright, since Evidence is a strict
 * superset). Kept separate on request: this one's a fast, narrow modal for `components`/`signals`/
 * `lineage`/`workState`; "View full evidence" below switches to the Sheet for the wider stuff
 * (coverage, calculation, suggested actions). `cell` and `evidence` requests use the same lazy-
 * fetch-on-open convention as V1's own `CellDetailCard`. Not yet live-verified against a real
 * response, unlike the main page.
 */
export function V2CellDetailDialogContent({
  cell,
  params,
  onViewEvidence,
}: {
  cell: LeakageV2Cell;
  params: Omit<GetLeakageCellV2Params, "cellId">;
  onViewEvidence: () => void;
}) {
  const { data, isLoading, isError, refetch } = useGetLeakageCellV2({ cellId: cell.id, ...params });
  const detail = data?.data;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{cell.coordinate.mechanismLabel}</DialogTitle>
      </DialogHeader>
      <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
        <p className="text-[11.5px] text-ink-3">
          {cell.coordinate.revenueStageLabel} · {cell.coordinate.stateDimensionLabel}: {cell.coordinate.stateValueLabel}
        </p>

        {isLoading && (
          <div className="mt-4">
            <DetailSkeleton />
          </div>
        )}

        {!isLoading && (isError || !detail) && (
          <div className="mt-4">
            <p className="text-[11.5px] text-rose">Couldn't load this cell's detail.</p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {detail && (
          <div className="mt-4 space-y-5">
            <p className="text-[10.5px] text-ink-4">As of {formatRelativeTime(detail.publication.asOfUtc)}</p>

            {detail.components.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>
                  Contributing candidates ({detail.components.length})
                </SectionLabel>
                <div className="mt-2 space-y-2">
                  {detail.components.map((component) => (
                    <div key={component.candidateId} className="flex items-baseline justify-between gap-3">
                      <span className="text-[11.5px] text-ink-2">
                        {humanizeEnum(component.mechanism)} · {humanizeEnum(component.revenueStage)}
                      </span>
                      <span className="text-right">
                        <p className="text-[12px] font-semibold text-ink tabular-nums">
                          {formatCompactMoney(component.amount.value, component.amount.currency)}
                        </p>
                        <p className="text-[10px] text-ink-4">{humanizeEnum(component.lifecycleClass)}</p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.signals.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Detector signals ({detail.signals.length})</SectionLabel>
                <div className="mt-2 space-y-2.5">
                  {detail.signals.map((signal) => (
                    <div key={signal.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[11.5px] text-ink-2">{signal.signalId}</span>
                        <span className="text-[11.5px] font-medium text-ink tabular-nums">{formatCount(signal.signalValue)}</span>
                      </div>
                      <p className="text-[10px] text-ink-4">
                        {formatShortDateWithYear(signal.observationFromUtc)} – {formatShortDateWithYear(signal.observationToUtc)} ·{" "}
                        {formatPercent(signal.confidence)} confidence · {signal.detectorVersion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.lineage.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Source lineage ({detail.lineage.length})</SectionLabel>
                <div className="mt-2 space-y-2.5">
                  {detail.lineage.map((entry, i) => (
                    <div key={`${entry.signalId}-${i}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[11.5px] text-ink-2">{entry.signalId}</span>
                        <span className="text-[11px] text-ink-4">{humanizeEnum(entry.sourceAvailability)}</span>
                      </div>
                      {entry.actions.length > 0 && (
                        <p className="mt-0.5 text-[10.5px] text-ink-4">{entry.actions.map((a) => a.label).join(" · ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.workState.explanation && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Case status</SectionLabel>
                <p className="mt-2 text-[11.5px] text-ink-3">{detail.workState.explanation}</p>
              </div>
            )}
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <div className="flex w-full justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onViewEvidence} disabled={!detail}>
            View full evidence
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
