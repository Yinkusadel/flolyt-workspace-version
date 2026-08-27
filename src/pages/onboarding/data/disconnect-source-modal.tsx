import { useState } from "react";
import { AlertTriangle, Users, UserX } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useDisconnectDatasource from "@/features/datasources/use-disconnect-datasource";

/**
 * Ported from the old dashboard's delete-datasource-modal.tsx. Two steps because
 * docs/endpoints/datasources.md requires an explicit typed-confirmation step before a UI
 * is allowed to ever send deleteCustomers=true — this is a hard delete of customer data.
 */
export function DisconnectSourceModal({
  connectionId,
  connectionName,
  onClose,
  onDisconnected,
}: {
  connectionId: string;
  connectionName: string;
  onClose: () => void;
  onDisconnected: () => void;
}) {
  const [step, setStep] = useState<"confirm" | "customers">("confirm");
  const [typedName, setTypedName] = useState("");
  const [deleteCustomers, setDeleteCustomers] = useState<boolean | null>(null);
  const { disconnectAsync, isPending } = useDisconnectDatasource({ onSuccess: onDisconnected });

  const isConfirmed = typedName.trim() === connectionName.trim();

  const handleDisconnect = async () => {
    if (deleteCustomers === null) return;
    try {
      await disconnectAsync({ id: connectionId, confirm: connectionName, deleteCustomers });
    } catch {
      // toasted by the hook
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-md">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <div className="mb-1 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-bg">
                  <AlertTriangle className="size-4.5 text-rose" />
                </div>
                <DialogTitle>Disconnect datasource</DialogTitle>
              </div>
              <DialogDescription>
                This is permanent and cannot be undone. All derived events, attributes, and tokens will be
                cleaned up.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 px-5 py-4 sm:px-7">
              <p className="text-[12px] text-ink-2">
                Type <span className="font-semibold text-ink">"{connectionName}"</span> to confirm
              </p>
              <Input value={typedName} onChange={(e) => setTypedName(e.currentTarget.value)} placeholder={connectionName} />
              {typedName.length > 0 && !isConfirmed && (
                <p className="text-[10.5px] text-destructive">Name does not match</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={() => setStep("customers")} disabled={!isConfirmed}>
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "customers" && (
          <>
            <DialogHeader>
              <div className="mb-1 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-bg">
                  <Users className="size-4.5 text-rose" />
                </div>
                <DialogTitle>Delete customers?</DialogTitle>
              </div>
              <DialogDescription>
                Choose whether to also delete customers exclusively imported from "{connectionName}". Customers
                shared across multiple sources are always preserved.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5 px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={() => setDeleteCustomers(false)}
                className={cn(
                  "w-full rounded-panel border p-3.5 text-left transition-colors",
                  deleteCustomers === false ? "border-rose-border bg-rose-bg/60" : "border-line hover:bg-paper-2"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <Users className="mt-0.5 size-4 shrink-0 text-ink-4" />
                  <div>
                    <p className="text-[12px] font-medium text-ink">Keep customers</p>
                    <p className="mt-0.5 text-[11px] text-ink-4">Disconnect but retain all customer records.</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeleteCustomers(true)}
                className={cn(
                  "w-full rounded-panel border p-3.5 text-left transition-colors",
                  deleteCustomers === true ? "border-rose-border bg-rose-bg/60" : "border-line hover:bg-paper-2"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <UserX className="mt-0.5 size-4 shrink-0 text-ink-4" />
                  <div>
                    <p className="text-[12px] font-medium text-ink">Delete customers</p>
                    <p className="mt-0.5 text-[11px] text-ink-4">
                      Permanently delete customers imported exclusively from this datasource.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep("confirm")} disabled={isPending}>
                Back
              </Button>
              <Button type="button" variant="destructive" onClick={handleDisconnect} disabled={deleteCustomers === null || isPending}>
                {isPending ? "Disconnecting..." : "Disconnect"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
