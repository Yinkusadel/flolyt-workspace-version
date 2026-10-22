import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";
import { SourceLogo } from "@/pages/onboarding/data/source-card";
import { formatDateTime, statusTone } from "@/pages/data-sources/format";
import { KvRow } from "@/pages/data-sources/kv-row";

function ConnectionRowSkeleton() {
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

export function ConnectionListSkeleton() {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <ConnectionRowSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * One connected/disconnected row, shared by the Connected and Disconnected tabs — only the
 * trailing `actions` (Disconnect vs. Reconnect) differ between them. The toggle button covers
 * everything except `actions` so the action buttons stay real siblings, not nested buttons.
 */
export function ConnectionRow({
  connection,
  actions,
}: {
  connection: ConnectedDatasourceDto;
  actions: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const metadataEntries = Object.entries(connection.metadata ?? {});

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
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
            <Chip tone={statusTone(connection.connectionStatus)}>{connection.connectionStatus}</Chip>
            {connection.lastSyncedOn && (
              <p className="text-[10px] text-ink-4">Synced {formatDateTime(connection.lastSyncedOn)}</p>
            )}
          </div>

          <ChevronDown
            className={cn("size-3.5 shrink-0 text-ink-4 transition-transform", expanded && "rotate-180")}
            aria-hidden
          />
        </button>

        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>

      {expanded && (
        <div className="divide-y divide-line border-t border-line bg-paper">
          <KvRow label="Connected on" value={formatDateTime(connection.connectedOn)} />
          {connection.disconnectedOn && (
            <KvRow label="Disconnected on" value={formatDateTime(connection.disconnectedOn)} />
          )}
          <KvRow
            label="Records synced"
            value={connection.lastSyncRecordCount != null ? connection.lastSyncRecordCount.toLocaleString() : "—"}
          />
          <KvRow label="Architecture" value={connection.architecture} />
          {connection.targetSchemaName && <KvRow label="Target schema" value={connection.targetSchemaName} />}
          {connection.lastSyncError && (
            <KvRow label="Last sync error" value={connection.lastSyncError} tone="rose" />
          )}
          {metadataEntries.map(([key, value]) => (
            <KvRow key={key} label={key} value={String(value)} />
          ))}
        </div>
      )}
    </div>
  );
}
