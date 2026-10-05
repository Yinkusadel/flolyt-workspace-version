import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { getLeakageCell } from "@/services/api/leakage/get-leakage-cell";
import { openRoomOnLeakageCell } from "@/services/api/leakage/open-room-on-leakage-cell";

export interface OpenRoomFromLeakParams {
  grid: string;
  row: string;
  condition: string;
  currency: string;
}

// Resolves an `openRoom` chat action's grid/row/condition/currency into a real room the same way
// the leakage map's own "Start a room" button does (`CellDetailCard.handleStartRoom` in
// leakage-map/detail-panel.tsx): fetch the cell, join its already-open room if one exists,
// otherwise open one from its server-computed draft — never inventing a title/settlement
// ourselves, same rule that button follows. Returns the room id to navigate to, or `null` if the
// cell can't back a room at all (no `room` and no `draft` — a data gap, not a measured leak).
export const useOpenRoomFromLeak = () =>
  useMutation({
    mutationFn: async (params: OpenRoomFromLeakParams): Promise<string | null> => {
      const cellRes = await getLeakageCell(params);
      if (!cellRes.succeeded) throw new Error(cellRes.messages?.[0] || "Failed to load this leak");
      const cell = cellRes.data;

      if (cell.room) return cell.room.roomId;
      if (!cell.draft) return null;

      const openRes = await openRoomOnLeakageCell({
        grid: cell.grid,
        row: cell.rowKey,
        condition: cell.conditionKey,
        currency: cell.currency,
        title: cell.draft.title,
        settlement: {
          settlesWhen: cell.draft.settlesWhen,
          measuredOverDays: cell.draft.measuredOverDays,
          primaryMeasure: cell.draft.primaryMeasure,
          revenueBasis: cell.draft.revenueBasis,
          holdoutPercent: cell.draft.holdoutPercent,
          wouldProveUsWrong: cell.draft.wouldProveUsWrong,
        },
      });
      if (!openRes.succeeded) throw new Error(openRes.messages?.[0] || "Failed to open a room on this leak");
      return openRes.data;
    },
    onError: (error: Error) => toast.error(error.message || "Couldn't open a room from this suggestion"),
  });
