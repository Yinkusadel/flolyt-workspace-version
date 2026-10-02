import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { SheetBody, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney, formatShortDateWithYear } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import { useGetLeakageCellHistory } from "@/features/leakage/use-get-leakage-cell-history";
import type { GetLeakageCellHistoryParams } from "@/services/api/leakage/get-leakage-cell-history";
import type { LeakageV2Cell } from "@/services/api/leakage/get-leakage";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

function HistorySkeleton() {
  return (
    <div className="divide-y divide-line/70">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="py-2.5 first:pt-0">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-16 rounded-chip" />
          </div>
          <Skeleton className="mt-1.5 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * `GET /cells/{cellId}/history` — the last of the handoff doc's 4 scaffolded-but-never-built V2
 * routes to get a real UI; see docs/leakage-map/v2-build-plan.md's "Current endpoint status" for
 * why the other 3 (coverage/calculation/cutover-readiness) stayed unbuilt. Entry point is a "View
 * history" link next to the Evidence Sheet's own "As of" line, not the quick-glance Dialog's
 * footer — the handoff doc groups History alongside Detail/Coverage/Calculation as one of this
 * cell's "panels", and Coverage/Calculation already live in Evidence rather than the Dialog, so
 * this follows the same placement logic. `points[]` is newest-first per the doc ("Published
 * history, newest first") — rendered in that order, not re-sorted. Not yet live-verified against a
 * real response.
 */
export function V2CellHistorySheetContent({ cell, params }: { cell: LeakageV2Cell; params: Omit<GetLeakageCellHistoryParams, "cellId"> }) {
  const { data, isLoading, isError, refetch } = useGetLeakageCellHistory({ cellId: cell.id, ...params });
  const history = data?.data;

  return (
    <>
      <SheetHeader>
        <SheetTitle>{cell.coordinate.mechanismLabel}</SheetTitle>
        <SheetDescription>
          {cell.coordinate.revenueStageLabel} · {cell.coordinate.stateDimensionLabel}: {cell.coordinate.stateValueLabel}
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="px-5 py-5">
        {isLoading && <HistorySkeleton />}

        {!isLoading && (isError || !history) && (
          <div>
            <p className="text-[11.5px] text-rose">Couldn't load this cell's history.</p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {history && history.points.length === 0 && (
          <p className="text-[11.5px] text-ink-3">No published history yet for this cell.</p>
        )}

        {history && history.points.length > 0 && (
          <div>
            <SectionLabel>Published history ({history.points.length})</SectionLabel>
            <div className="mt-2 divide-y divide-line/70">
              {history.points.map((point) => (
                <div key={point.snapshotId} className="py-2.5 first:pt-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11.5px] font-medium text-ink-2">{formatShortDateWithYear(point.publishedAtUtc)}</span>
                    <Chip tone="neutral">{humanizeEnum(point.state.display)}</Chip>
                  </div>
                  {point.amounts.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      {point.amounts.map((amount, i) => (
                        <div key={i} className="flex items-baseline justify-between gap-3">
                          <span className="text-[10.5px] text-ink-4">{humanizeEnum(amount.lifecycleClass)}</span>
                          <span className="text-[12px] font-semibold text-ink tabular-nums">
                            {formatCompactMoney(amount.value, amount.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetBody>
    </>
  );
}
