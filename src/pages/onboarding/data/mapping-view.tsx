import { Check, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/components/ui/rail";
import type { DataMapDto } from "@/services/api/workspace/get-data-map";
import { MappingTable, toMappingRows } from "@/pages/onboarding/data/mapping-table";

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

  const rows = toMappingRows(dataMap);

  const entityCount = dataMap.summary.entitiesCovered.length;

  // "awaiting_analysis"/"nothing_connected" mean the backend hasn't finished reading the
  // schema yet — same signal /mapping-quality uses for "not ready". An empty table list is
  // the same situation surfacing a beat before `state` catches up, so gate on both.
  const isStillMapping =
    dataMap.state === "awaiting_analysis" || dataMap.state === "nothing_connected" || rows.length === 0;

  return (
    <div className="flex flex-col gap-6 pb-6 md:min-h-0 md:flex-1">
      <div className="flex shrink-0 items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-teal text-white">
          <Check className="size-4" />
        </span>
        <div>
          <h1 className="text-[19px] font-semibold text-ink">{heading}</h1>
          <p className="mt-2 text-[12.5px] text-ink-3">
            Flolyt mapped what it found into the customer graph.
            {entityCount > 0
              ? ` Check the mapping. Everything downstream is built on ${entityCount === 1 ? "this entity" : `these ${entityCount} entities`}.`
              : " Check the mapping below. Everything downstream is built on it."}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="shrink-0">
          <Callout tone="neutral" title="Still mapping your data">
            This can take a minute right after connecting. Flolyt has to read your schema before it can
            map anything. Check again in a bit.
          </Callout>
        </div>
      ) : (
        <div className="md:min-h-0 md:flex-1 md:overflow-y-auto">
          <MappingTable rows={rows} showSourceName={sourceCount > 1} />
        </div>
      )}

      {dataMap.summary.uncountedTableCount > 0 && (
        <div className="shrink-0">
          <Callout tone="neutral" title="Some row counts aren't in yet">
            {dataMap.summary.uncountedTableCount === 1
              ? "One table hasn't reported a row count yet. That reads as 0 until the warehouse estimates it, not as empty."
              : `${dataMap.summary.uncountedTableCount} tables haven't reported a row count yet. Those read as 0 until the warehouse estimates them, not as empty.`}
          </Callout>
        </div>
      )}

      {rows.length > 0 && !isStillMapping && (
        <p className="shrink-0 text-[11px] leading-relaxed text-ink-3">
          Tables in this list can be linked to each other, for example transactions to customers. You
          can set that up after onboarding under Data, then Relationships.
        </p>
      )}

      <div className="flex shrink-0 flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onConnectNewSource}
          className="h-10.5 w-full sm:w-auto"
        >
          Connect new source
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
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

          <Button
            type="button"
            onClick={onContinue}
            disabled={isContinuing || isStillMapping}
            title={isStillMapping ? "Waiting for the mapping to finish" : undefined}
            className="h-10.5 w-full rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto"
          >
            {isContinuing ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
