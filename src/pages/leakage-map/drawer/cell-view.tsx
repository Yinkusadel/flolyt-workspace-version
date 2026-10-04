import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MessageSquare, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SheetBody, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney, formatShortDateWithYear } from "@/lib/format-measured-value";
import useGetWorkspaceMembers from "@/features/workspace/use-get-workspace-members";
import { useCreateLeakageCase } from "@/features/leakage/use-create-leakage-case";
import { useGetLeakageCase } from "@/features/leakage/use-get-leakage-case";
import { useGetLeakageCellHistory } from "@/features/leakage/use-get-leakage-cell-history";
import { useGetLeakageCellV2 } from "@/features/leakage/use-get-leakage-cell-v2";
import type { CellDetailV2, GetLeakageCellV2Params } from "@/services/api/leakage/get-leakage-cell-v2";
import type { LeakageV2Amount, LeakageV2Cell, LeakageV2Controls } from "@/services/api/leakage/get-leakage";
import {
  availabilityPhrase,
  compareCurrencies,
  formatHeadlineMoney,
  humanizeEnum,
  isUnassignedMarket,
  MODE_TITLE,
} from "@/pages/leakage-map/format";
import { CASE_STATUS_TONE, FieldLabel, PRIMARY_ACTION_CLASS, resolveOwnerName, SectionLabel } from "@/pages/leakage-map/drawer/shared";

/** The calculation controls the detail, history and Learn Why calls share: never the market or currency filters. */
export type CellQuery = Omit<GetLeakageCellV2Params, "cellId">;

type TabKey = "amounts" | "summary" | "components" | "signals" | "sources" | "history";
const TABS: { key: TabKey; label: string }[] = [
  { key: "amounts", label: "Amounts" },
  { key: "summary", label: "Summary" },
  { key: "components", label: "Components" },
  { key: "signals", label: "Signals" },
  { key: "sources", label: "Sources" },
  { key: "history", label: "History" },
];

/** Long lists (a cell can carry hundreds of signals) reveal in steps instead of rendering all at once. */
const PAGE_STEP = 20;

interface CellViewProps {
  cell: LeakageV2Cell;
  query: CellQuery;
  controls: LeakageV2Controls;
  onOpenCase: (caseId: string) => void;
}

/**
 * The cell drawer's main view. The header, chips and per-currency table render straight from the card's own
 * data so they never wait; everything that needs the cell's detail call (the case strip and the tabs) shows
 * a placeholder of its own until `GET /cells/{id}` returns. Case actions live here, not on the card, because
 * `workState` is only in the detail response.
 */
export function CellView({ cell, query, controls, onOpenCase }: CellViewProps) {
  const { data, isLoading, isError, refetch } = useGetLeakageCellV2({ cellId: cell.id, ...query });
  // The per-currency table lives in its own tab so a cell with many currencies never pushes the other tabs down.
  // A cell with no amounts (unmeasured) has no Amounts tab and opens on Summary.
  const [pickedTab, setPickedTab] = useState<TabKey | null>(null);
  const detail = data?.data;
  const live = detail?.cell ?? cell;

  const lead = live.amounts[0];
  const tabs = live.amounts.length > 0 ? TABS : TABS.filter((t) => t.key !== "amounts");
  const tab: TabKey = pickedTab && tabs.some((t) => t.key === pickedTab) ? pickedTab : tabs[0].key;
  const unassigned = live.amounts.some((a) => isUnassignedMarket(a.market));
  const modeTitle = MODE_TITLE[query.mode?.toUpperCase() ?? ""] ?? humanizeEnum(query.mode ?? "");

  return (
    <>
      <SheetHeader className="gap-1.5">
        <p className="font-mono text-[10px] tracking-wide text-ink-3 uppercase">
          {live.coordinate.revenueStageLabel}
          <span className="text-ink-4">
            {" "}
            · {live.coordinate.stateDimensionLabel} → {live.coordinate.stateValueLabel} · {live.coordinate.subject.unit}
          </span>
        </p>
        <SheetTitle className="text-[18px]">{live.coordinate.mechanismLabel}</SheetTitle>
        <SheetDescription className="sr-only">Detail for {live.coordinate.mechanismLabel}</SheetDescription>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Chip tone={live.state.display === "POPULATED" ? "teal" : "neutral"}>
            {live.state.display === "POPULATED"
              ? "Measured"
              : live.state.display === "NO_EXPOSURE"
                ? "No exposure found"
                : "Not measured"}
          </Chip>
          {live.state.facets.includes("COMPOUND") && <Chip>Compound</Chip>}
          <Chip>{availabilityPhrase(live.state.sourceAvailability)}</Chip>
          {lead && (
            <Chip>
              {modeTitle} · {lead.horizonDays}d
            </Chip>
          )}
          {unassigned && <Chip tone="ultra">Unassigned market</Chip>}
        </div>
      </SheetHeader>

      <SheetBody className="space-y-5 px-5 py-5">
        {live.state.display === "POPULATED" && <CaseStrip cell={live} detail={detail} isLoading={isLoading} onOpenCase={onOpenCase} />}

        <div>
          <div role="tablist" aria-label="Cell detail" className="flex items-center gap-1 overflow-x-auto border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                onClick={() => setPickedTab(t.key)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
                  tab === t.key
                    ? "border-ultra font-semibold text-ink"
                    : "border-transparent font-normal text-ink-3 hover:text-ink-2"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {tab === "amounts" && <AmountsTable amounts={live.amounts} reportingCurrency={controls.reportingCurrency} />}
            {tab === "summary" && <SummaryTab cell={live} />}
            {tab === "history" && <HistoryTab cell={live} query={query} />}
            {(tab === "components" || tab === "signals" || tab === "sources") && (
              <>
                {isLoading && <ListSkeleton />}
                {!isLoading && (isError || !detail) && (
                  <div>
                    <p className="text-[11.5px] text-rose">Couldn't load this cell's detail.</p>
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                      Retry
                    </Button>
                  </div>
                )}
                {detail && tab === "components" && <ComponentsTab detail={detail} />}
                {detail && tab === "signals" && <SignalsTab detail={detail} />}
                {detail && tab === "sources" && <SourcesTab detail={detail} />}
              </>
            )}
          </div>
        </div>
      </SheetBody>
    </>
  );
}

/** Case state for this cell, read from the detail call's `workState`. */
function CaseStrip({
  cell,
  detail,
  isLoading,
  onOpenCase,
}: {
  cell: LeakageV2Cell;
  detail: CellDetailV2 | undefined;
  isLoading: boolean;
  onOpenCase: (caseId: string) => void;
}) {
  const { members } = useGetWorkspaceMembers();
  const { mutate: createCase, isPending: isCreatingCase } = useCreateLeakageCase();
  const caseId = detail?.workState.revenueLeakCaseId ?? undefined;
  const { data: caseData, isLoading: isLoadingCase } = useGetLeakageCase(caseId, !!caseId);
  const leakCase = caseData?.data;

  const lead = cell.amounts[0];
  const hasLeakToAct = cell.state.display === "POPULATED" && !!lead && lead.value > 0;
  // READY alone is not enough: the server refuses a case on anything that is not a populated finding with measured exposure.
  const canStartCase = hasLeakToAct && !!detail && !caseId && detail.workState.state === "READY";

  if (isLoading || (caseId && isLoadingCase)) return <Skeleton className="h-[68px] w-full rounded-card" />;
  if (!detail) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-card border p-3.5",
        leakCase?.isOverdue ? "border-rose-border bg-rose-bg/40" : "border-line bg-paper-2"
      )}
    >
      {caseId && leakCase ? (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Chip tone={CASE_STATUS_TONE[leakCase.status]}>{humanizeEnum(leakCase.status)}</Chip>
            {leakCase.isOverdue && <Chip tone="rose">Overdue</Chip>}
            <span className="flex items-center gap-1 text-[11.5px] text-ink-2">
              <User className="size-3 text-ink-4" />
              {resolveOwnerName(members, leakCase.ownerUserId)}
            </span>
            <span className={cn("flex items-center gap-1 text-[11.5px]", leakCase.isOverdue ? "text-rose" : "text-ink-2")}>
              <Calendar className="size-3 text-ink-4" />
              Due {formatShortDateWithYear(leakCase.dueAtUtc)}
            </span>
            {leakCase.roomId && (
              <span className="flex items-center gap-1 text-[11.5px] text-ink-3">
                <MessageSquare className="size-3 text-ink-4" />
                Room linked
              </span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {leakCase.roomId && (
              <Button asChild type="button" size="sm" variant="outline">
                <Link to={`/rooms/${leakCase.roomId}`}>Open Room</Link>
              </Button>
            )}
            <Button type="button" size="sm" className={PRIMARY_ACTION_CLASS} onClick={() => onOpenCase(leakCase.id)}>
              Open case
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="min-w-0 flex-1 text-[11.5px] text-ink-3">
            {canStartCase ? "No case yet for this finding." : detail.workState.explanation}
          </p>
          <Button
            type="button"
            size="sm"
            className={PRIMARY_ACTION_CLASS}
            disabled={!canStartCase || isCreatingCase}
            onClick={() =>
              createCase(
                { cellId: cell.id, dueAtUtc: null },
                { onSuccess: (res) => res.succeeded && onOpenCase(res.data.id) }
              )
            }
          >
            {isCreatingCase ? "Opening…" : "Start a case"}
          </Button>
        </>
      )}
    </div>
  );
}

/** One row per currency, each money column the server's own figure; nothing is added across currencies. */
function AmountsTable({ amounts, reportingCurrency }: { amounts: LeakageV2Amount[]; reportingCurrency: string | null }) {
  const byCurrency = compareCurrencies(reportingCurrency);
  const rows = [...amounts].sort((a, b) => byCurrency(a.currency, b.currency));
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[40rem] text-left text-[11.5px] whitespace-nowrap">
        <thead>
          <tr className="border-b border-line bg-paper-2 text-[10px] text-ink-4">
            {["Currency", "Gross", "Expected", "Net", "Range", "Confidence", "Severity", "Candidates"].map((h, i) => (
              <th key={h} className={cn("px-3 py-2 font-medium", i > 0 && i < 4 && "text-right", i === 7 && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((a) => {
            const range = a.range.status !== "UNAVAILABLE" && a.range.lower != null && a.range.upper != null;
            return (
              <tr key={`${a.currency}|${a.market}|${a.lifecycleClass}`}>
                <td className="px-3 py-2 font-mono font-semibold text-ink">{a.currency}</td>
                <td className="px-3 py-2 text-right font-mono text-ink">{formatCompactMoney(a.gross, a.currency)}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-2">{formatCompactMoney(a.expected, a.currency)}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-2">{formatCompactMoney(a.net, a.currency)}</td>
                <td className="px-3 py-2 font-mono text-[10.5px] text-ink-3">
                  {range ? (
                    <>
                      {formatCompactMoney(a.range.lower as number, a.currency)} – {formatCompactMoney(a.range.upper as number, a.currency)}
                    </>
                  ) : (
                    "Not available"
                  )}
                </td>
                <td className="px-3 py-2 text-ink-2">
                  {a.confidenceLevel.toUpperCase() === "NOT_AVAILABLE"
                    ? "Not rated"
                    : `${humanizeEnum(a.confidenceLevel)} ${a.confidence.toFixed(2)}`}
                </td>
                <td className="px-3 py-2 text-ink-2">{a.severity.toUpperCase() === "NOT_AVAILABLE" ? "Not rated" : a.severity.toUpperCase()}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-2">{a.candidateCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Every limitation the server recorded for this cell, in full (the card only shows the first). */
function SummaryTab({ cell }: { cell: LeakageV2Cell }) {
  return (
    <div className="space-y-2.5">
      <SectionLabel>Limitations ({cell.limitations.length})</SectionLabel>
      {cell.limitations.length === 0 ? (
        <p className="text-[11.5px] text-ink-3">The server recorded no limitations for this cell.</p>
      ) : (
        <ul className="space-y-2">
          {cell.limitations.map((limitation, i) => (
            <li key={i} className="rounded-control border border-line bg-paper-2 px-3 py-2 text-[11.5px] leading-relaxed text-ink-2">
              {limitation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="divide-y divide-line/70">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-2.5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

function ShowMore({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  if (shown >= total) return null;
  return (
    <button type="button" onClick={onMore} className="mt-3 text-[11.5px] font-medium text-ultra hover:underline">
      Show {Math.min(PAGE_STEP, total - shown)} more ({total - shown} left)
    </button>
  );
}

function ComponentsTab({ detail }: { detail: CellDetailV2 }) {
  const [shown, setShown] = useState(PAGE_STEP);
  if (detail.components.length === 0) return <p className="text-[11.5px] text-ink-3">No components for this cell.</p>;
  return (
    <div>
      <SectionLabel>Independently calculated candidates ({detail.components.length})</SectionLabel>
      <div className="mt-2 divide-y divide-line/70">
        {detail.components.slice(0, shown).map((c) => (
          <div key={c.candidateId} className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="min-w-0">
              <p className="truncate font-mono text-[11px] text-ink-2">{c.candidateId.slice(0, 8)}</p>
              <p className="text-[10px] text-ink-4">
                {c.signalId} · {humanizeEnum(c.lifecycleClass)}
              </p>
            </span>
            <span className="font-mono text-[12px] font-semibold text-ink">{formatHeadlineMoney(c.amount.value, c.amount.currency)}</span>
          </div>
        ))}
      </div>
      <ShowMore shown={shown} total={detail.components.length} onMore={() => setShown((n) => n + PAGE_STEP)} />
    </div>
  );
}

function SignalsTab({ detail }: { detail: CellDetailV2 }) {
  const [shown, setShown] = useState(PAGE_STEP);
  if (detail.signals.length === 0) return <p className="text-[11.5px] text-ink-3">No detector signals for this cell.</p>;
  return (
    <div>
      <SectionLabel>Detector signals ({detail.signals.length})</SectionLabel>
      <div className="mt-2 divide-y divide-line/70">
        {detail.signals.slice(0, shown).map((s) => (
          <div key={s.id} className="py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11.5px] text-ink-2">{s.signalId}</span>
              <span className="font-mono text-[11.5px] font-medium text-ink">{s.signalValue}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-ink-4">
              {formatShortDateWithYear(s.observationFromUtc)} to {formatShortDateWithYear(s.observationToUtc)} · confidence{" "}
              {s.confidence.toFixed(2)} · {s.detectorVersion}
              {s.currency ? ` · ${s.currency}` : ""}
              {s.attribution ? ` · market ${s.attribution.code}` : ""}
            </p>
          </div>
        ))}
      </div>
      <ShowMore shown={shown} total={detail.signals.length} onMore={() => setShown((n) => n + PAGE_STEP)} />
    </div>
  );
}

/**
 * Which source and capability produced this cell's state, with the server's own remediation actions. The
 * lineage's actions carry no `eligible` flag in the contract, so an action is offered only when the API
 * lists it, and only the datasource ones link anywhere (to the Data sources page; there is no per-capability
 * deep link yet). Anything else is shown as text, never as a button.
 */
function SourcesTab({ detail }: { detail: CellDetailV2 }) {
  if (detail.lineage.length === 0) return <p className="text-[11.5px] text-ink-3">No source lineage recorded for this cell.</p>;
  return (
    <div>
      <SectionLabel>Source lineage ({detail.lineage.length})</SectionLabel>
      <div className="mt-2 divide-y divide-line/70">
        {detail.lineage.map((entry, i) => (
          <div key={`${entry.signalId}-${i}`} className="py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11.5px] font-medium text-ink-2">{entry.capabilityId}</span>
              <span className="text-[10.5px] text-ink-3">{availabilityPhrase(entry.sourceAvailability)}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-ink-4">
              {entry.signalId} · {entry.selectedSourceIds.length} {entry.selectedSourceIds.length === 1 ? "source" : "sources"} · resolver{" "}
              {entry.resolverVersion}
            </p>
            {entry.actions.map((action, j) => (
              <div key={j} className="mt-2 rounded-control border border-line bg-paper-2 p-2.5">
                <p className="text-[11.5px] font-medium text-ink-2">{action.label}</p>
                {action.missingRequirements.length > 0 && (
                  <p className="mt-0.5 text-[10.5px] text-ink-3">Needs {action.missingRequirements.join(", ")}</p>
                )}
                {action.kind.startsWith("sources.") && (
                  <Button asChild type="button" size="sm" className={cn("mt-2", PRIMARY_ACTION_CLASS)}>
                    <Link to="/data-sources">Review data sources</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Published snapshots for this cell, newest first as the API sends them. An empty list is a valid "no earlier publication". */
function HistoryTab({ cell, query }: { cell: LeakageV2Cell; query: CellQuery }) {
  const { data, isLoading, isError, refetch } = useGetLeakageCellHistory({
    cellId: cell.id,
    mode: query.mode,
    lifecycleClass: query.lifecycleClass,
  });
  const history = data?.data;
  if (isLoading) return <ListSkeleton />;
  if (isError || !history) {
    return (
      <div>
        <p className="text-[11.5px] text-rose">Couldn't load this cell's history.</p>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }
  if (history.points.length === 0) return <p className="text-[11.5px] text-ink-3">No earlier publication for this cell.</p>;
  return (
    <div>
      <SectionLabel>Published history ({history.points.length})</SectionLabel>
      <div className="mt-2 divide-y divide-line/70">
        {history.points.map((point) => (
          <div key={point.snapshotId} className="py-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11.5px] font-medium text-ink-2">{formatShortDateWithYear(point.publishedAtUtc)}</span>
              <Chip>{humanizeEnum(point.state.display)}</Chip>
            </div>
            {point.amounts.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                {point.amounts.map((a, i) => (
                  <span key={i} className="font-mono text-[11.5px] font-semibold text-ink">
                    {formatCompactMoney(a.value, a.currency)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <FieldLabel className="mt-3">Earlier publications may lack confidence and range detail.</FieldLabel>
    </div>
  );
}
