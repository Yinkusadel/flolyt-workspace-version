import { useMemo, useState } from "react";
import { Search, Link2, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";
import useReconnectDatasource from "@/features/datasources/use-reconnect-datasource";
import { SourceLogo } from "@/pages/onboarding/data/source-card";
import { DisconnectSourceModal } from "@/pages/onboarding/data/disconnect-source-modal";

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function ConnectedListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-panel border border-line bg-paper p-4">
          <Skeleton className="size-9 rounded-control" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ConnectedList({
  connectedDatasources,
  onSelect,
}: {
  connectedDatasources: ConnectedDatasourceDto[];
  onSelect: (connection: ConnectedDatasourceDto) => void;
}) {
  const [search, setSearch] = useState("");
  const [disconnectTarget, setDisconnectTarget] = useState<ConnectedDatasourceDto | null>(null);
  const { reconnect, isPending: isReconnecting } = useReconnectDatasource();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return connectedDatasources;
    return connectedDatasources.filter((ds) =>
      (ds.datasourceDisplayName || ds.connectionName).toLowerCase().includes(term)
    );
  }, [connectedDatasources, search]);

  if (connectedDatasources.length === 0) {
    return <p className="text-[12px] text-ink-3">No sources connected yet.</p>;
  }

  return (
    <div className="flex flex-col md:h-full md:min-h-0">
      <div className="relative max-w-sm shrink-0">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name..."
          className="h-8 pl-8"
        />
      </div>

      <div className="mt-4 grid auto-rows-min grid-cols-1 gap-3 pb-6 sm:grid-cols-2 md:min-h-0 md:flex-1 md:overflow-y-auto">
        {filtered.map((ds) => (
          <div key={ds.id} className="rounded-panel border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => onSelect(ds)}
                className="flex flex-1 items-start gap-3 text-left"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line bg-paper-2">
                  <SourceLogo name={ds.datasourceName} className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-ink">
                    {ds.datasourceDisplayName || ds.connectionName}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ink-4">{ds.category}</p>
                </div>
              </button>

              {ds.isActive ? (
                <button
                  type="button"
                  onClick={() => setDisconnectTarget(ds)}
                  className="shrink-0 rounded-control p-1.5 text-ink-4 transition-colors hover:bg-rose-bg hover:text-rose"
                  aria-label="Disconnect"
                >
                  <Trash2 className="size-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => reconnect(ds.id)}
                  disabled={isReconnecting}
                  className="shrink-0 rounded-control p-1.5 text-ink-4 transition-colors hover:bg-teal-bg hover:text-teal disabled:opacity-40"
                  aria-label="Reconnect"
                >
                  <Link2 className="size-3.5" />
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[10.5px] text-ink-4">
              <Chip tone={ds.isActive ? "teal" : "neutral"}>{ds.isActive ? "active" : "disconnected"}</Chip>
              <span>Connected {formatDate(ds.connectedOn)}</span>
            </div>
          </div>
        ))}
      </div>

      {disconnectTarget && (
        <DisconnectSourceModal
          connectionId={disconnectTarget.id}
          connectionName={disconnectTarget.datasourceDisplayName || disconnectTarget.connectionName}
          onClose={() => setDisconnectTarget(null)}
          onDisconnected={() => setDisconnectTarget(null)}
        />
      )}
    </div>
  );
}
