import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";
import { SourceLogo } from "@/pages/onboarding/data/source-card";

function ConnectedRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-9 shrink-0 rounded-control" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-4.5 w-14 shrink-0 rounded-chip" />
    </div>
  );
}

export function ConnectedSourcesListSkeleton() {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <ConnectedRowSkeleton key={i} />
      ))}
    </div>
  );
}

function ConnectedRow({ connection }: { connection: ConnectedDatasourceDto }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line bg-paper">
        <SourceLogo name={connection.datasourceName} className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-semibold text-ink">{connection.connectionName}</p>
        <p className="truncate text-[10.5px] text-ink-4">
          {connection.datasourceDisplayName} · {connection.category}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <Chip tone={connection.isActive ? "teal" : "neutral"}>{connection.connectionStatus}</Chip>
        {connection.lastSyncedOn && (
          <p className="text-[10px] text-ink-4">Synced {new Date(connection.lastSyncedOn).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}

export function ConnectedSourcesList({
  connections,
  onGoToSources,
}: {
  connections: ConnectedDatasourceDto[];
  onGoToSources: () => void;
}) {
  if (connections.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper-2 p-8 text-center">
        <p className="text-[12.5px] font-semibold text-ink">No sources connected yet</p>
        <p className="mt-1 text-[11px] text-ink-3">
          Connect one from the{" "}
          <button type="button" onClick={onGoToSources} className="font-semibold text-ultra hover:underline">
            Sources
          </button>{" "}
          tab to start reading data.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {connections.map((connection) => (
        <ConnectedRow key={connection.id} connection={connection} />
      ))}
    </div>
  );
}
