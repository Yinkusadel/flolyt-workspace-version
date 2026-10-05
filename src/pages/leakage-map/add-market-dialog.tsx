import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { marketName } from "@/pages/leakage-map/format";
import { PRIMARY_ACTION_CLASS } from "@/pages/leakage-map/drawer/shared";

interface AddMarketDialogState {
  open: boolean;
  code: string;
  currency: string | null;
}

/**
 * Open/close state for the dialog. The dialog itself is always mounted with `open` starting false (Radix
 * Presence crashes under preact when a Dialog is mounted already open), and the market is remembered after
 * closing so the text does not blank out while it fades.
 */
export function useAddMarketDialog() {
  const [state, setState] = useState<AddMarketDialogState>({ open: false, code: "", currency: null });
  const openFor = useCallback((code: string, currency: string | null) => setState({ open: true, code, currency }), []);
  const setOpen = useCallback((open: boolean) => setState((prev) => ({ ...prev, open })), []);
  return { state, openFor, setOpen };
}

/**
 * Explains a market that shows up in the data but is not in the workspace's market list, and offers a link to
 * the Markets page with the country (and the market's preferred currency, as an editable suggestion) already
 * filled in. The link only navigates: nothing is saved here, and the Markets page still needs Save changes and
 * the emailed code. Who may save is not known on this page (the roles endpoint returns functional roles only),
 * so the text says it instead of hiding the button.
 */
export function AddMarketDialog({
  state,
  onOpenChange,
}: {
  state: AddMarketDialogState;
  onOpenChange: (open: boolean) => void;
}) {
  const name = state.code ? marketName(state.code) : "this market";
  const params = new URLSearchParams({ add: state.code });
  if (state.currency) params.set("currency", state.currency);

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader>
          <DialogTitle>Add {name} to your markets?</DialogTitle>
          <DialogDescription>
            {name} appears in your data, but it is not in your workspace's market list.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 text-[12px] leading-relaxed text-ink-2 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">What this means</p>
            <p className="mt-1.5">
              Flolyt found accounts in {name} in your connected data. Your market list is the one you set up on the
              Markets page, and this page never changes it for you.
            </p>
          </div>
          <div>
            <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">What the button does</p>
            <p className="mt-1.5">
              It opens the Markets page with {name}
              {state.currency ? ` and ${state.currency}` : ""} already filled in. You can change{" "}
              {state.currency ? "the currency" : "the details"} there. Nothing is saved until you press Save changes and
              confirm with the code we email you, and only an administrator can save market changes.
            </p>
          </div>
          <p className="text-[11.5px] text-ink-3">
            Amounts are attributed from your data, not from this list, so adding {name} does not move any money.
          </p>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button asChild className={PRIMARY_ACTION_CLASS}>
            <Link to={`/markets?${params.toString()}`}>Add to my markets</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
