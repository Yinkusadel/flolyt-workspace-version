import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";
import useReconnectDatasource from "@/features/datasources/use-reconnect-datasource";
import useTriggerDatasourceSync from "@/features/datasources/use-trigger-datasource-sync";
import { ConnectionRow } from "@/pages/data-sources/connection-row";
import { DisconnectDatasourceModal } from "@/pages/data-sources/disconnect-modal";

export { ConnectionListSkeleton as ConnectedSourcesListSkeleton } from "@/pages/data-sources/connection-row";

function ReconnectButton({ connectionId }: { connectionId: string }) {
  const { reconnect, isPending } = useReconnectDatasource();

  return (
    <Button type="button" size="sm" onClick={() => reconnect(connectionId)} disabled={isPending}>
      {isPending ? "Reconnecting…" : "Reconnect"}
    </Button>
  );
}

function SyncNowButton({ connectionId }: { connectionId: string }) {
  const { triggerSync, isPending } = useTriggerDatasourceSync();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => triggerSync(connectionId)}
      disabled={isPending}
    >
      <RefreshCw className={cn("size-3.5", isPending && "animate-spin")} />
      {isPending ? "Syncing…" : "Sync now"}
    </Button>
  );
}

/**
 * GET /connected is the only real endpoint here — there is no separate "list disconnected
 * datasources" endpoint, so this renders whatever it returns as one list rather than assuming a
 * disconnected row keeps showing up under a second tab. `isActive` on each row decides whether
 * its actions are Sync now + Disconnect, or just Reconnect.
 *
 * Sync now shows for every active row rather than being gated client-side: the catalog's
 * `supportsBulkSync` looked like the right signal but isn't — confirmed live, it let the button
 * show for a `BringYourOwnWarehouse` connection, which the backend then rejected with "Manual
 * sync is only available for Managed SaaS datasources." There's no field anywhere that reliably
 * says "this connection is Managed SaaS," so the backend's own per-connection validation is the
 * only real gate — `useTriggerDatasourceSync`'s error toast already surfaces that message.
 */
export function ConnectedSourcesList({
  connections,
  onGoToSources,
}: {
  connections: ConnectedDatasourceDto[];
  onGoToSources: () => void;
}) {
  const [disconnecting, setDisconnecting] = useState<ConnectedDatasourceDto | null>(null);

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
    <>
      <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
        {connections.map((connection) => (
          <ConnectionRow
            key={connection.id}
            connection={connection}
            actions={
              connection.isActive ? (
                <>
                  <SyncNowButton connectionId={connection.id} />
                  <Button type="button" variant="outline" size="sm" onClick={() => setDisconnecting(connection)}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <ReconnectButton connectionId={connection.id} />
              )
            }
          />
        ))}
      </div>

      {disconnecting && (
        <DisconnectDatasourceModal connection={disconnecting} onClose={() => setDisconnecting(null)} />
      )}
    </>
  );
}
