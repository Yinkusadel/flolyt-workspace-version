import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";
import { SourceLogo } from "@/pages/onboarding/data/source-card";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * `connectionStatus` has no documented enum (docs/endpoints/datasources.md leaves it a bare
 * `string`) — "SyncError" is the only value seen live so far. Classified by keyword rather than
 * an exact match list until more values show up.
 */
function statusTone(status: string): ChipTone {
  const s = status.toLowerCase();
  if (s.includes("error") || s.includes("fail")) return "rose";
  if (s.includes("disconnect")) return "neutral";
  if (s.includes("sync") || s.includes("pending")) return "amber";
  return "teal";
}

function KvRow({ label, value, tone }: { label: string; value: string; tone?: ChipTone }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-[10.5px] text-ink-3">{label}</span>
      <span
        className={cn(
          "font-mono text-[10.5px] sm:text-right",
          tone === "rose" ? "text-rose" : "text-ink-2"
        )}
      >
        {value}
      </span>
    </div>
  );
}

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
  const [expanded, setExpanded] = useState(false);
  const metadataEntries = Object.entries(connection.metadata ?? {});

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-paper"
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
