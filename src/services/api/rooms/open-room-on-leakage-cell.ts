import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface OpenRoomOnLeakageCellPayload {
  grid: string;
  rowKey: string;
  conditionKey: string;
  currency: string;
  title: string | null;
}

export interface OpenRoomOnLeakageCellResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { OPEN_ROOM_ON_LEAKAGE_CELL },
} = API_ENDPOINTS;

// Refused on a cell with no figure behind it. If a room is already open on the same coordinate,
// this joins that one instead of opening a duplicate.
export const openRoomOnLeakageCell = async (
  payload: OpenRoomOnLeakageCellPayload
): Promise<OpenRoomOnLeakageCellResponse> => {
  try {
    const response = await axiosInstance.post<OpenRoomOnLeakageCellResponse>(
      OPEN_ROOM_ON_LEAKAGE_CELL,
      payload,
      { headers: { "Content-Type": "application/json" } }
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
