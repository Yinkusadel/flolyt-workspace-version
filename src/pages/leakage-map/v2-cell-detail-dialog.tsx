import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { DialogBody, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney, formatCount, formatPercent, formatRelativeTime, formatShortDateWithYear } from "@/lib/format-measured-value";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import { useCreateLeakageCase } from "@/features/leakage/use-create-leakage-case";
import { useGetLeakageCase } from "@/features/leakage/use-get-leakage-case";
import { useGetLeakageCellV2 } from "@/features/leakage/use-get-leakage-cell-v2";
import { useLearnWhyLeakageCellV2 } from "@/features/leakage/use-learn-why-leakage-cell-v2";
import type { GetLeakageCellV2Params, LeakageV2WorkState } from "@/services/api/leakage/get-leakage-cell-v2";
import type { RevenueLeakCase } from "@/services/api/leakage/leakage-case-types";
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
 * The case's own info, no lifecycle actions — moved up near the top on request (2026-10-02) so it
 * reads alongside the figure itself rather than buried under components/signals/lineage, and given
 * a real nested-card treatment (same `bg-paper-2` pattern V1's own `CoveragePanel` and the Rollups
 * grid already use) instead of plain stacked text. "Open a case" still lives in the dialog's
 * footer (see `V2CellDetailDialogContent`). Once a case exists, "View case" opens the full
 * `V2CaseSheetContent` — owner/due-date/transitions/decisions/room all live there, not here. Owner
 * shows the raw `ownerUserId` — no user-name lookup is wired, so this is honestly an id, not a
 * display name, until one is.
 */
function CaseInfo({
  workState,
  leakCase,
  isLoadingCase,
  onViewCase,
}: {
  workState: LeakageV2WorkState;
  leakCase?: RevenueLeakCase;
  isLoadingCase: boolean;
  onViewCase: (caseId: string) => void;
}) {
  return (
    <div className="border-t border-line pt-4">
      <SectionLabel>Case</SectionLabel>
      <div className="mt-2 rounded-control border border-line bg-paper-2 p-3">
        {workState.revenueLeakCaseId && isLoadingCase && <Skeleton className="h-4 w-24" />}
        {workState.revenueLeakCaseId && leakCase ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Chip tone="neutral">{humanizeEnum(leakCase.status)}</Chip>
                {leakCase.isOverdue && <Chip tone="rose">Overdue</Chip>}
              </div>
              <button
                type="button"
                onClick={() => onViewCase(leakCase.id)}
                className="text-[11px] font-medium text-ultra hover:underline"
              >
                View case
              </button>
            </div>
            <p className="text-[11px] text-ink-4">{leakCase.ownerUserId ? `Owner: ${leakCase.ownerUserId}` : "Unassigned"}</p>
            <p className="text-[11px] text-ink-4">Due {formatShortDateWithYear(leakCase.dueAtUtc)}</p>
            {leakCase.decisions.length > 0 && (
              <p className="text-[11px] text-ink-4">
                {leakCase.decisions.length} decision{leakCase.decisions.length === 1 ? "" : "s"} logged
              </p>
            )}
          </div>
        ) : (
          !workState.revenueLeakCaseId && <p className="text-[11.5px] text-ink-3">{workState.explanation}</p>
        )}
      </div>
    </div>
  );
}

/**
 * The cell-detail dialog's content — a quick-glance view, restored 2026-10-02 alongside the fuller
 * `V2CellEvidenceSheetContent` (which briefly replaced it outright, since Evidence is a strict
 * superset). Kept separate on request: this one's a fast, narrow modal for `components`/`signals`/
 * `lineage`/`workState`; "View full evidence" switches to the Sheet for the wider stuff (coverage,
 * calculation, suggested actions). "Learn why" starts `POST /cells/{cellId}/learn-why`, same
 * fire-and-navigate pattern V1's own `CellDetailCard` already uses — the mutation's result is just
 * a `conversationId`/`runId` pointer; the actual SSE streaming, reconnect, and answer rendering all
 * happen on the existing `/conversations/{id}` route, not rebuilt here. Case handling off
 * `workState`: `revenueLeakCaseId` present means an existing case's live status is fetched and
 * shown (`CaseInfo`, near the top); otherwise `state === "READY"` offers "Open a case" in the
 * footer, `"UNREADY"` shows only the gate's own explanation. `cell`/`evidence` requests use the
 * same lazy-fetch-on-open convention as V1's `CellDetailCard` too. Not yet live-verified against a
 * real response, unlike the main page — this is the furthest-scaffolded, least-tested part of V2
 * so far.
 */
export function V2CellDetailDialogContent({
  cell,
  params,
  onViewEvidence,
  onViewCase,
}: {
  cell: LeakageV2Cell;
  params: Omit<GetLeakageCellV2Params, "cellId">;
  onViewEvidence: () => void;
  onViewCase: (caseId: string) => void;
}) {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetLeakageCellV2({ cellId: cell.id, ...params });
  const { mutate: learnWhy, isPending: isAskingWhy } = useLearnWhyLeakageCellV2();
  const detail = data?.data;

  const caseId = detail?.workState.revenueLeakCaseId ?? undefined;
  const { data: caseData, isLoading: isLoadingCase } = useGetLeakageCase(caseId, !!caseId);
  const { mutate: createCase, isPending: isCreatingCase } = useCreateLeakageCase();

  // Mirrors V1's own two-refusal gate (docs/endpoints/leakage.md's learn-why section): "a gap is
  // not a question" (nothing measured) and "a real zero is a result, not a gap" (measured but
  // nothing to explain). V2's handoff doc doesn't restate this rule for the V2 route explicitly,
  // but the same logic applies to the same kind of figure — inferred by analogy, not copied from
  // doc text, so revisit if a real response disagrees.
  const primaryAmount = cell.amounts[0];
  const hasLeakToExplain = cell.state.display === "POPULATED" && !!primaryAmount && primaryAmount.value > 0;
  // `workState.state === "READY"` alone isn't sufficient — confirmed live 2026-10-02, the server
  // refused a READY-but-not-populated cell with "A case can only be opened for a populated finding
  // with measured exposure." Gated on the same `hasLeakToExplain` check Learn Why already uses,
  // since it's the same underlying requirement (a real, measured figure to act on).
  const canOpenCase = hasLeakToExplain && !!detail && !detail.workState.revenueLeakCaseId && detail.workState.state === "READY";

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

            <CaseInfo workState={detail.workState} leakCase={caseData?.data} isLoadingCase={isLoadingCase} onViewCase={onViewCase} />

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
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {hasLeakToExplain && (
              <button
                type="button"
                disabled={isAskingWhy}
                onClick={() =>
                  learnWhy({ cellId: cell.id, ...params }, { onSuccess: (res) => navigate(`/conversations/${res.data.conversationId}`) })
                }
                className="inline-flex items-center gap-1.5 rounded-control border border-line bg-paper-2 px-2.5 py-1.5 text-[11px] font-medium text-ink-2 hover:bg-paper disabled:opacity-60"
              >
                <HelpCircle className="size-3.5" />
                {isAskingWhy ? "Asking…" : "Learn why"}
              </button>
            )}
            {canOpenCase && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isCreatingCase}
                onClick={() => createCase({ cellId: cell.id, dueAtUtc: null })}
              >
                {isCreatingCase ? "Opening…" : "Open a case"}
              </Button>
            )}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onViewEvidence} disabled={!detail}>
            View full evidence
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
