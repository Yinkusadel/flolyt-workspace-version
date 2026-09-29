import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface OpenLeakageRoomSettlementPayload {
  settlesWhen: string[];
  measuredOverDays: number;
  primaryMeasure: string;
  revenueBasis: string;
  holdoutPercent?: number | null;
  noHoldoutBecause?: string | null;
  wouldProveUsWrong?: string | null;
}

export interface OpenRoomOnLeakageCellPayload {
  grid: string;
  row: string;
  condition: string;
  currency: string;
  title: string | null;
  settlement: OpenLeakageRoomSettlementPayload;
}

export interface OpenRoomOnLeakageCellResponse {
  /** The room's id — the same one as an agent-proposed room on this coordinate, if one exists. */
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { OPEN_ROOM_ON_LEAKAGE_CELL },
} = API_ENDPOINTS;

// Second door onto the same command the agent's proposal card runs — the coordinate dedups, so
// this joins an already-open room on the same cell instead of splitting the evidence in two.
// Refused on a cell with no figure behind it.
export const openRoomOnLeakageCell = async ({
  grid,
  row,
  condition,
  currency,
  title,
  settlement,
}: OpenRoomOnLeakageCellPayload): Promise<OpenRoomOnLeakageCellResponse> => {
  try {
    const response = await axiosInstance.post<OpenRoomOnLeakageCellResponse>(
      OPEN_ROOM_ON_LEAKAGE_CELL.replace("{grid}", grid)
        .replace("{row}", row)
        .replace("{condition}", condition)
        .replace("{currency}", currency),
      { title, settlement }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to open a room on this cell");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
