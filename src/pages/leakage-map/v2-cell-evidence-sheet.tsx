import { Button } from "@/components/ui/button";
import { SheetBody, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCompactMoney,
  formatCount,
  formatPercent,
  formatRelativeTime,
  formatShortDateWithYear,
} from "@/lib/format-measured-value";
import { humanizeEnum } from "@/pages/leakage-map/v2-filters";
import { useGetLeakageCellEvidence } from "@/features/leakage/use-get-leakage-cell-evidence";
import type { GetLeakageCellEvidenceParams } from "@/services/api/leakage/get-leakage-cell-evidence";
import type { LeakageV2Cell } from "@/services/api/leakage/get-leakage";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

function EvidenceSkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

/**
 * The evidence sheet — `GET /leakage/cells/{cellId}/evidence`, replaces the earlier cell-detail
 * Dialog outright (2026-10-02): Evidence is a strict superset of `CellDetailV2` (same cell/
 * components/signals/lineage/workState, plus coverage, calculation, limitations, suggestedActions,
 * and a citable `evidenceId`), so there's no reason to fetch and show both. Also avoids ever
 * nesting two Radix `Dialog.Root`-family overlays (Sheet is built on the same primitive as Dialog)
 * — see [[preact_radix_dialog_crash]].
 *
 * Not yet wired: any of `suggestedActions[]`'s real behavior (review/open_room/rooms.view/
 * sources.review_capability/sources.connect) and case creation off `workState` — both render as
 * plain informational text for now rather than a non-functional button, per
 * [[feedback_no_bypass_auth_for_verification]]'s sibling principle of never faking a working
 * control. Also still not live-verified against a real response, unlike the main page.
 */
export function V2CellEvidenceSheetContent({ cell, params }: { cell: LeakageV2Cell; params: Omit<GetLeakageCellEvidenceParams, "cellId"> }) {
  const { data, isLoading, isError, refetch } = useGetLeakageCellEvidence({ cellId: cell.id, ...params });
  const evidence = data?.data;

  return (
    <>
      <SheetHeader>
        <SheetTitle>{cell.coordinate.mechanismLabel}</SheetTitle>
        <SheetDescription>
          {cell.coordinate.revenueStageLabel} · {cell.coordinate.stateDimensionLabel}: {cell.coordinate.stateValueLabel}
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="px-5 py-5">
        {isLoading && <EvidenceSkeleton />}

        {!isLoading && (isError || !evidence) && (
          <div>
            <p className="text-[11.5px] text-rose">Couldn't load this cell's evidence.</p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {evidence && (
          <div className="space-y-5">
            {evidence.question && <p className="text-[12.5px] font-medium text-ink">{evidence.question}</p>}
            <p className="text-[10.5px] text-ink-4">As of {formatRelativeTime(evidence.publication.asOfUtc)}</p>

            {evidence.components.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Contributing candidates ({evidence.components.length})</SectionLabel>
                <div className="mt-2 space-y-2">
                  {evidence.components.map((component) => (
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

            {evidence.signals.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Detector signals ({evidence.signals.length})</SectionLabel>
                <div className="mt-2 space-y-2.5">
                  {evidence.signals.map((signal) => (
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

            {evidence.lineage.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Source lineage ({evidence.lineage.length})</SectionLabel>
                <div className="mt-2 space-y-3">
                  {evidence.lineage.map((entry, i) => (
                    <div key={`${entry.signalId}-${i}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[11.5px] text-ink-2">{entry.signalId}</span>
                        <span className="text-[11px] text-ink-4">{humanizeEnum(entry.sourceAvailability)}</span>
                      </div>
                      {entry.explanation && <p className="mt-0.5 text-[10.5px] text-ink-4">{entry.explanation}</p>}
                      {entry.candidates.length > 0 && (
                        <div className="mt-1.5 space-y-1 border-l border-line pl-2.5">
                          {entry.candidates.map((candidate, ci) => (
                            <p key={`${candidate.sourceId}-${ci}`} className="text-[10.5px] text-ink-3">
                              {candidate.sourceName} <span className="text-ink-4">· {humanizeEnum(candidate.state)}</span>
                            </p>
                          ))}
                        </div>
                      )}
                      {entry.actions.length > 0 && (
                        <p className="mt-1 text-[10.5px] text-ink-4">{entry.actions.map((a) => a.label).join(" · ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evidence.coverage.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Coverage ({evidence.coverage.length})</SectionLabel>
                <div className="mt-2 space-y-2">
                  {evidence.coverage.map((entry, i) => (
                    <div key={`${entry.signalId}-${i}`}>
                      <p className="text-[11.5px] text-ink-2">{entry.signalId}</p>
                      <p className="text-[10px] text-ink-4">
                        Capability {formatPercent(entry.capability)} · Scope {formatPercent(entry.scope)} · Freshness{" "}
                        {formatPercent(entry.freshness)} · Quality {formatPercent(entry.quality)}
                      </p>
                      <p className="text-[10px] text-ink-4">
                        {formatCount(entry.usableUnits)}/{formatCount(entry.eligibleUnits)} usable ·{" "}
                        {formatCount(entry.residualUnknownUnits)} unknown
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(evidence.calculationPolicies.length > 0 || evidence.calculationFormulas.length > 0) && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Calculation</SectionLabel>
                {evidence.calculationPolicies.map((policy, i) => (
                  <div key={`${policy.baselineId}-${i}`} className="mt-2">
                    <p className="text-[11.5px] text-ink-2">
                      {humanizeEnum(policy.sector)} · {humanizeEnum(policy.mechanism)}
                    </p>
                    <p className="text-[10px] text-ink-4">
                      Baseline {policy.baselineBasis} · Ramp {policy.rampVersion} · Recovery {formatPercent(policy.recoveryRate)} (
                      {policy.recoveryBasis}) · Severity currency {policy.severityCurrency}
                    </p>
                  </div>
                ))}
                {evidence.calculationFormulas.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {evidence.calculationFormulas.map((formula, i) => (
                      <p key={i} className="font-mono text-[10.5px] text-ink-3">
                        {formula}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {evidence.limitations.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Limitations ({evidence.limitations.length})</SectionLabel>
                <div className="mt-2 space-y-1">
                  {evidence.limitations.map((line, i) => (
                    <p key={i} className="text-[10.5px] text-ink-4">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {evidence.workState.explanation && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Case status</SectionLabel>
                <p className="mt-2 text-[11.5px] text-ink-3">{evidence.workState.explanation}</p>
              </div>
            )}

            {evidence.suggestedActions.length > 0 && (
              <div className="border-t border-line pt-4">
                <SectionLabel>Suggested actions</SectionLabel>
                <div className="mt-2 space-y-1">
                  {evidence.suggestedActions.map((action) => (
                    <p key={action.id} className="text-[11.5px] text-ink-3">
                      {action.label}
                      {!action.eligibility.eligible && action.eligibility.reason && (
                        <span className="text-ink-4"> · {action.eligibility.reason}</span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetBody>
    </>
  );
}
