import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLeakageCellV2 } from "@/features/leakage/use-get-leakage-cell-v2";
import type { LeakageV2Cell, LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import type { LeakageFilters } from "@/pages/leakage-map/filters";
import { CaseView } from "@/pages/leakage-map/drawer/case-view";
import { CellView, type CellQuery } from "@/pages/leakage-map/drawer/cell-view";
import type { DrawerPanel } from "@/pages/leakage-map/drawer/use-cell-drawer-param";

interface CellDrawerProps {
  cells: LeakageV2Cell[];
  controls: LeakageV2Controls;
  filters: LeakageFilters;
  /** The snapshot the map is showing now. */
  currentSnapshotId: string;
  cellId: string | null;
  panel: DrawerPanel;
  onClose: () => void;
  onShowCase: (cellId: string) => void;
  onShowCell: (cellId: string) => void;
}

/**
 * The side drawer for one leak type. Which cell is open, and whether it shows the cell or its case, is
 * decided by the URL (see `useCellDrawerParam`). The detail, history and Learn Why calls take the page's
 * calculation controls (mode, horizon, lifecycle) but never its market or currency filters, so the drawer
 * shows the same cell whatever the filters narrowed the page to.
 */
export function CellDrawer({ cells, controls, filters, currentSnapshotId, cellId, panel, onClose, onShowCase, onShowCell }: CellDrawerProps) {
  const cell = cellId ? cells.find((c) => c.id === cellId) : undefined;

  const query = useMemo<CellQuery>(
    () => ({
      mode: filters.mode,
      horizon: filters.horizon,
      horizonDays: filters.horizon === "custom" ? filters.horizonDays : undefined,
      lifecycleClass: filters.lifecycleClass ?? undefined,
    }),
    [filters.mode, filters.horizon, filters.horizonDays, filters.lifecycleClass]
  );

  return (
    <Sheet open={!!cell} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[46rem]">
        {cell && panel === "case" ? (
          <CaseLoader
            cell={cell}
            query={query}
            currentSnapshotId={currentSnapshotId}
            onBack={() => onShowCell(cell.id)}
          />
        ) : cell ? (
          <CellView cell={cell} query={query} controls={controls} onOpenCase={() => onShowCase(cell.id)} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

/** The case view needs the case id, which only the cell's detail call carries (the detail request is shared with the cell view's, so this is normally already cached). */
function CaseLoader({
  cell,
  query,
  currentSnapshotId,
  onBack,
}: {
  cell: LeakageV2Cell;
  query: CellQuery;
  currentSnapshotId: string;
  onBack: () => void;
}) {
  const { data, isLoading } = useGetLeakageCellV2({ cellId: cell.id, ...query });
  const caseId = data?.data.workState.revenueLeakCaseId;

  if (caseId) {
    return (
      <CaseView
        caseId={caseId}
        cell={cell}
        defaultMode={query.mode ?? "expected"}
        currentSnapshotId={currentSnapshotId}
        onBack={onBack}
      />
    );
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>Case · {cell.coordinate.mechanismLabel}</SheetTitle>
        <SheetDescription>{cell.coordinate.revenueStageLabel}</SheetDescription>
      </SheetHeader>
      <SheetBody className="px-5 py-5">
        {isLoading ? (
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        ) : (
          <div>
            <p className="text-[11.5px] text-ink-3">There is no case for this finding yet.</p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onBack}>
              Back to {cell.coordinate.mechanismLabel}
            </Button>
          </div>
        )}
      </SheetBody>
    </>
  );
}
