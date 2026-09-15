import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import type { DatasourceDisconnectionDto } from "@/services/api/datasources/get-datasource-disconnections";
import useReconnectDatasource from "@/features/datasources/use-reconnect-datasource";
import { SourceLogo } from "@/pages/onboarding/data/source-card";
import { formatDateTime } from "@/pages/data-sources/format";

function DisconnectionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-9 shrink-0 rounded-control" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-40" />
      </div>
      <Skeleton className="h-7 w-20 shrink-0 rounded-lg" />
    </div>
  );
}

export function DisconnectionHistoryListSkeleton() {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <DisconnectionRowSkeleton key={i} />
      ))}
    </div>
  );
}

function ReconnectButton({ datasourceId }: { datasourceId: string }) {
  const { reconnect, isPending } = useReconnectDatasource();

  return (
    <Button type="button" size="sm" onClick={() => reconnect(datasourceId)} disabled={isPending}>
      {isPending ? "Reconnecting…" : "Reconnect"}
    </Button>
  );
}

function DisconnectionRow({ record }: { record: DatasourceDisconnectionDto }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line bg-paper">
        <SourceLogo name={record.datasourceDisplayName} className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-semibold text-ink">{record.datasourceDisplayName}</p>
        <p className="truncate text-[10.5px] text-ink-4">
          Requested {formatDateTime(record.requestedAt)}
          {record.completedAt ? ` · Completed ${formatDateTime(record.completedAt)}` : " · Not completed"}
        </p>
        <p className="mt-0.5 text-[10.5px] text-ink-4">
          {record.candidateCustomerCount} candidate{record.candidateCustomerCount === 1 ? "" : "s"} ·{" "}
          {record.actuallyDeletedCount} deleted · {record.multiSourceCustomersPreservedCount} preserved
        </p>
        {record.softCeilingExceeded && (
          <Chip tone="amber" className="mt-1.5">
            Soft ceiling exceeded
          </Chip>
        )}
        {record.error && <p className="mt-1.5 text-[10.5px] text-rose">{record.error}</p>}
      </div>

      <ReconnectButton datasourceId={record.datasourceId} />
    </div>
  );
}

/**
 * GET /disconnections is the disconnect-with-delete audit trail, not a "list of disconnected
 * datasources" endpoint — but each record's `datasourceId` is the only lead left once a
 * connection has dropped out of `GET /connected` entirely. Wiring Reconnect to fire
 * `POST /{datasourceId}/reconnect` with that value is a live experiment the user asked for,
 * not a confirmed-working path yet — watch the toast from useReconnectDatasource for whether
 * the backend actually accepts this id shape.
 */
export function DisconnectionHistoryList({ records }: { records: DatasourceDisconnectionDto[] }) {
  if (records.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">No disconnect events yet</p>
        <p className="mt-1 text-[11px] text-ink-3">
          Every disconnect-with-delete action against a source shows up here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {records.map((record) => (
        <DisconnectionRow key={record.id} record={record} />
      ))}
    </div>
  );
}
