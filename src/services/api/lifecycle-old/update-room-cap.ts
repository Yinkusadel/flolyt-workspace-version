import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateRoomCapPayload {
  cap: number;
}

export interface UpdateRoomCapResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { UPDATE_ROOM_CAP },
} = API_ENDPOINTS;

// Administrator only. Counts auto-opened rooms only — a stage can hold at most one. 0 means
// nothing opens on its own, every firing becomes a proposal instead.
export const updateRoomCap = async ({ cap }: UpdateRoomCapPayload): Promise<UpdateRoomCapResponse> => {
  try {
    const response = await axiosInstance.put<UpdateRoomCapResponse>(
      UPDATE_ROOM_CAP,
      { cap },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the room cap");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
