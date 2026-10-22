import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/rail";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataMapDto } from "@/services/api/workspace/get-data-map";
import {
  MappingTable,
  toMappingRows,
} from "@/pages/onboarding/data/mapping-table";

export function MappingListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function MappingListError({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <div className="space-y-3">
      <Callout tone="rose" title="Couldn't load the mapping">
        Flolyt couldn't read the data map just now. Try again in a moment.
      </Callout>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Checking..." : "Try again"}
      </Button>
    </div>
  );
}

/**
 * Data sources, Mapping tab: the same GET .../workspace/data-map table the onboarding step shows,
 * for every connected source at once, so the mapping can be checked after onboarding too.
 */
export function MappingList({
  dataMap,
  onRefresh,
  isRefreshing,
}: {
  dataMap: DataMapDto;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const rows = toMappingRows(dataMap);
  const sourceCount = dataMap.sources.length;
  const entityCount = dataMap.summary.entitiesCovered.length;

  if (rows.length === 0) {
    return (
      <div className="space-y-3">
        <Callout
          tone="neutral"
          title={
            sourceCount === 0 ? "Nothing to map yet" : "Still mapping your data"
          }
        >
          {sourceCount === 0
            ? "Connect a source and Flolyt will map its tables into the customer graph here."
            : "This can take a minute after connecting. Flolyt has to read your schema before it can map anything."}
        </Callout>
        {sourceCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Checking..." : "Check again"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-[11.5px] text-ink-3">
        {sourceCount === 1
          ? `Tables Flolyt read from ${dataMap.sources[0].name}`
          : `Tables Flolyt read from ${sourceCount} sources`}
        {entityCount > 0
          ? `, mapped into the customer graph. Everything downstream is built on ${entityCount === 1 ? "this entity" : `these ${entityCount} entities`}.`
          : ", mapped into the customer graph."}
      </p>

      <div>
        <MappingTable rows={rows} showSourceName={sourceCount > 1} />
      </div>

      {dataMap.summary.uncountedTableCount > 0 && (
        <Callout tone="neutral" title="Some row counts aren't in yet">
          {dataMap.summary.uncountedTableCount === 1
            ? "One table hasn't reported a row count yet. That reads as 0 until the warehouse estimates it, not as empty."
            : `${dataMap.summary.uncountedTableCount} tables haven't reported a row count yet. Those read as 0 until the warehouse estimates them, not as empty.`}
        </Callout>
      )}

      <p className="text-[11px] text-ink-3">
        Tables in this list can be linked to each other, for example
        transactions to customers.{" "}
        <Link
          to="/relationships"
          className="font-semibold text-ultra hover:underline"
        >
          Manage relationships
        </Link>
      </p>
    </div>
  );
}
