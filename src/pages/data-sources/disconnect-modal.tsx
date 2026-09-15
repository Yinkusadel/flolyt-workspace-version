import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDisconnectDatasource from "@/features/datasources/use-disconnect-datasource";
import type { ConnectedDatasourceDto } from "@/services/api/datasources/get-connected-datasources";

/**
 * POST /{id}/disconnect defaults to a plain disconnect. Passing deleteCustomers=true also
 * hard-deletes every customer exclusively imported from this source (multi-source customers are
 * preserved) — per docs/endpoints/datasources.md's note, that path requires the caller to type
 * the datasource's display name back as `confirm` before the API will act on it.
 */
export function DisconnectDatasourceModal({
  connection,
  onClose,
}: {
  connection: ConnectedDatasourceDto;
  onClose: () => void;
}) {
  const [deleteCustomers, setDeleteCustomers] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { disconnect, isPending } = useDisconnectDatasource({ onSuccess: onClose });

  const displayName = connection.datasourceDisplayName;
  const confirmMatches = confirmText.trim() === displayName;
  const canSubmit = !deleteCustomers || confirmMatches;

  const handleDisconnect = () => {
    if (!canSubmit || isPending) return;
    disconnect(
      deleteCustomers
        ? { id: connection.id, deleteCustomers: true, confirm: confirmText.trim() }
        : { id: connection.id }
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader>
          <DialogTitle>Disconnect {connection.connectionName}</DialogTitle>
          <DialogDescription>
            Flolyt stops reading from {displayName} right away. You can reconnect it later from the
            Disconnected tab.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start justify-between gap-4 rounded-panel border border-rose-border bg-rose-bg p-3.5">
            <div>
              <p className="text-[12px] font-semibold text-ink">Also delete customers from this source</p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
                Hard-deletes every customer exclusively imported from {displayName}. Customers also
                seen through another connected source are preserved.
              </p>
            </div>
            <Switch
              checked={deleteCustomers}
              onCheckedChange={setDeleteCustomers}
              className="mt-0.5 shrink-0"
            />
          </div>

          {deleteCustomers && (
            <div>
              <label className="mb-1.5 block text-[11px] text-ink-3">
                Type <span className="font-semibold text-ink">{displayName}</span> to confirm
              </label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.currentTarget.value)}
                placeholder={displayName}
                aria-invalid={confirmText.length > 0 && !confirmMatches}
              />
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDisconnect}
              disabled={!canSubmit || isPending}
            >
              {isPending ? "Disconnecting…" : "Disconnect"}
            </Button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
