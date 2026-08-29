import { Check, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import type { DataMapDto, DataMapTableDto } from "@/services/api/workspace/get-data-map";

const CONFIDENCE_CLASS: Record<"high" | "medium" | "low", string> = {
  high: "text-teal",
  medium: "text-amber",
  low: "text-rose",
};

type TableRow = DataMapTableDto & { sourceName: string };

export function MappingViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * flolyt-figma-designs/onboarding/06-source-connected.svg. The "one mapping is worth a second
 * look" / "Fix the join" callout is deliberately left out — per the backend, a fix may never be
 * something the tenant can do, so that surface isn't built until it's clear there's a real
 * action behind it. mappedColumns and rowCount come straight off GET .../workspace/data-map —
 * see docs/endpoints/workspace.md for the "why" behind rendering unmapped rows and rounding
 * rowCount rather than treating it as an exact or per-day figure.
 */
export function MappingView({
  dataMap,
  onConnectNewSource,
  onContinue,
  isContinuing,
  onRefresh,
  isRefreshing,
}: {
  dataMap: DataMapDto;
  onConnectNewSource: () => void;
  onContinue: () => void;
  isContinuing: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const sourceCount = dataMap.sources.length;
  const heading =
    sourceCount === 1
      ? `${dataMap.sources[0].name} is connected and reading`
      : sourceCount > 1
        ? `${sourceCount} sources connected and reading`
        : "Your sources are connected and reading";

  const rows: TableRow[] = dataMap.sources.flatMap((source) =>
    source.tables.map((table) => ({ ...table, sourceName: source.name }))
  );

  const entityCount = dataMap.summary.entitiesCovered.length;

  // "awaiting_analysis"/"nothing_connected" mean the backend hasn't finished reading the
  // schema yet — same signal /mapping-quality uses for "not ready". An empty table list is
  // the same situation surfacing a beat before `state` catches up, so gate on both.
  const isStillMapping =
    dataMap.state === "awaiting_analysis" || dataMap.state === "nothing_connected" || rows.length === 0;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-teal text-white">
          <Check className="size-4" />
        </span>
        <div>
          <h1 className="text-[19px] font-semibold text-ink">{heading}</h1>
          <p className="mt-2 text-[12.5px] text-ink-3">
            Flolyt mapped what it found into the customer graph.
            {entityCount > 0
              ? ` Check the mapping — everything downstream is built on ${entityCount === 1 ? "this entity" : `these ${entityCount} entities`}.`
              : " Check the mapping below — everything downstream is built on it."}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <Callout tone="neutral" title="Still mapping your data">
          This can take a minute right after connecting — Flolyt has to read your schema before it can
          map anything. Check again in a bit.
        </Callout>
      ) : (
        <div>
          <div className="hidden border-b border-line pb-2.5 sm:grid sm:grid-cols-[1fr_90px_1fr_90px] sm:gap-3">
            <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">Your table</p>
            <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">Rows</p>
            <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">Mapped to</p>
            <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">Confidence</p>
          </div>

          {rows.map((row, i) => (
            <div
              key={`${row.sourceName}-${row.tableName}-${i}`}
              className="flex flex-col gap-2 border-b border-line py-3 sm:grid sm:grid-cols-[1fr_90px_1fr_90px] sm:items-center sm:gap-3"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-[12px] text-ink">{row.tableName}</p>
                {sourceCount > 1 && <p className="mt-0.5 text-[10px] text-ink-4">{row.sourceName}</p>}
              </div>

              <div className="flex items-center justify-between gap-3 sm:block">
                <span className="font-mono text-[9px] tracking-[0.85px] text-ink-4 uppercase sm:hidden">
                  Rows
                </span>
                <p className="font-mono text-[11.5px] text-ink-2">{row.rowCount.toLocaleString()}</p>
              </div>

              <div className="min-w-0">
                {row.mappedTo ? (
                  <>
                    <p className="text-[12px] font-semibold text-ink">{row.mappedTo}</p>
                    {row.mappedColumns.length > 0 && (
                      <div className="group/cols relative mt-0.5 sm:w-fit sm:max-w-full">
                        {/* Wraps freely on mobile (no truncate/tooltip — a nowrap span here was
                            forcing the whole page's layout viewport to blow past device width,
                            which mobile browsers respond to by auto-zooming out to fit; the
                            hover tooltip is also unreachable on touch anyway). Truncated with a
                            hover tooltip only from sm: up, where the grid gives it a fixed track
                            width to truncate against. */}
                        <p className="font-mono text-[10px] text-ink-4 sm:truncate">
                          {row.mappedColumns.join(", ")}
                        </p>
                        <div
                          role="tooltip"
                          className="pointer-events-none absolute top-full left-0 z-50 mt-1.5 hidden w-max max-w-xs rounded-panel bg-ink px-3 py-1.5 font-mono text-[11px] text-paper opacity-0 shadow-md transition-opacity duration-150 group-hover/cols:opacity-100 sm:block"
                        >
                          {row.mappedColumns.join(", ")}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-[12px] text-ink-4">not mapped</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 sm:block">
                <span className="font-mono text-[9px] tracking-[0.85px] text-ink-4 uppercase sm:hidden">
                  Confidence
                </span>
                <p
                  className={cn(
                    "font-mono text-[11px] font-semibold",
                    row.confidenceBand ? CONFIDENCE_CLASS[row.confidenceBand] : "text-ink-4"
                  )}
                >
                  {row.confidenceBand ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {dataMap.summary.uncountedTableCount > 0 && (
        <Callout tone="neutral" title="Some row counts aren't in yet">
          {dataMap.summary.uncountedTableCount === 1
            ? "One table hasn't reported a row count yet — that reads as 0 until the warehouse estimates it, not as empty."
            : `${dataMap.summary.uncountedTableCount} tables haven't reported a row count yet — those read as 0 until the warehouse estimates them, not as empty.`}
        </Callout>
      )}

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <Button
            type="button"
            onClick={onContinue}
            disabled={isContinuing || isStillMapping}
            title={isStillMapping ? "Waiting for the mapping to finish" : undefined}
            className="h-10.5 w-full rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto"
          >
            {isContinuing ? "Saving..." : "Continue"}
          </Button>

          {isStillMapping && (
            <Button
              type="button"
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10.5 w-full gap-1.5 sm:w-auto"
            >
              <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Checking..." : "Check again"}
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onConnectNewSource}
          className="h-10.5 w-full sm:w-auto"
        >
          Connect new source
        </Button>
      </div>
    </div>
  );
}
