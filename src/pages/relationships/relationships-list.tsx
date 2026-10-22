import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import useGetRelationships from "@/features/datasource-relationships/use-get-relationships";
import useGetRelationshipCatalog from "@/features/datasource-relationships/use-get-relationship-catalog";
import type {
  RelationshipDatasetScope,
  RelationshipMapping,
} from "@/services/api/datasource-relationships/types";
import { CARDINALITY_LABEL, STATE_LABEL, STATE_TONE } from "@/pages/relationships/labels";

const PAGE_SIZE = 25;

function RelationshipRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-2.5 w-3/4" />
      </div>
      <Skeleton className="h-4.5 w-16 shrink-0 rounded-chip" />
    </div>
  );
}

export function RelationshipsListSkeleton() {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <RelationshipRowSkeleton key={i} />
      ))}
    </div>
  );
}

function EndpointLabel({
  dataset,
  keyColumns,
  sourceLabels,
}: {
  dataset: RelationshipDatasetScope;
  keyColumns: string[];
  sourceLabels: Map<string, string>;
}) {
  // Never show a datasourceId as a label: fall back to the dataset name alone.
  const sourceLabel = sourceLabels.get(dataset.datasourceId);

  return (
    <span className="min-w-0">
      {sourceLabel && <span className="text-ink-4">{sourceLabel} / </span>}
      <span className="font-medium text-ink-2">{dataset.datasetId}</span>{" "}
      <span className="font-mono text-[10px] text-ink-3">({keyColumns.join(", ")})</span>
    </span>
  );
}

function RelationshipRow({
  mapping,
  sourceLabels,
}: {
  mapping: RelationshipMapping;
  sourceLabels: Map<string, string>;
}) {
  const { definition } = mapping;

  return (
    <Link
      to={`/relationships/${mapping.id}`}
      className="group flex flex-wrap items-start gap-x-4 gap-y-2 px-4 py-3 hover:bg-paper"
    >
      <div className="min-w-0 flex-1 basis-72">
        <p className="truncate text-[12.5px] font-semibold text-ultra group-hover:underline">{definition.name}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10.5px]">
          <EndpointLabel
            dataset={definition.from.dataset}
            keyColumns={definition.from.keyColumns}
            sourceLabels={sourceLabels}
          />
          <ArrowRight className="size-3 shrink-0 text-ink-4" aria-hidden />
          <EndpointLabel
            dataset={definition.to.dataset}
            keyColumns={definition.to.keyColumns}
            sourceLabels={sourceLabels}
          />
        </p>
        <p className="mt-1 text-[10.5px] text-ink-4">
          {definition.meaning} · {CARDINALITY_LABEL[definition.cardinality] ?? definition.cardinality}
          {definition.crosswalk ? " · through a bridge table" : ""}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <Chip tone={STATE_TONE[mapping.state] ?? "neutral"}>
          {STATE_LABEL[mapping.state] ?? mapping.state}
        </Chip>
        <p className="text-[10px] text-ink-4">Revision {mapping.revision}</p>
      </div>
    </Link>
  );
}

/**
 * GET /datasource-relationships (list). Declare opens the form; preview and approval come in later
 * steps, so rows have no action yet. Source labels come
 * from the catalog, matched on `datasourceId`, because a mapping's dataset scope carries no label.
 */
export function RelationshipsList({ onDeclare }: { onDeclare: () => void }) {
  const [offset, setOffset] = useState(0);
  const { relationships, total, isLoading, isError, error, refetch, isFetching } =
    useGetRelationships({ offset, limit: PAGE_SIZE });
  const { datasets } = useGetRelationshipCatalog();

  const sourceLabels = useMemo(
    () => new Map(datasets.map((d) => [d.dataset.datasourceId, d.sourceLabel])),
    [datasets]
  );

  if (isLoading) return <RelationshipsListSkeleton />;

  if (isError) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">Could not load relationships</p>
        <p className="mt-1 text-[11px] text-ink-3">{error?.message}</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">No relationships yet</p>
        <p className="mx-auto mt-1 max-w-md text-[11px] text-ink-3">
          A relationship tells Flolyt how records in one source match records in another, for
          example an invoice's account ID and an account's ID. Nothing takes effect until an
          administrator previews and approves it.
        </p>
        <Button type="button" size="sm" className="mt-3" onClick={onDeclare}>
          Declare relationship
        </Button>
      </div>
    );
  }

  const from = offset + 1;
  const to = offset + relationships.length;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={onDeclare}>
          Declare relationship
        </Button>
      </div>
      <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
        {relationships.map((mapping) => (
          <RelationshipRow key={mapping.id} mapping={mapping} sourceLabels={sourceLabels} />
        ))}
      </div>

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10.5px] text-ink-4">
            {from} to {to} of {total}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={offset === 0 || isFetching}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={to >= total || isFetching}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
