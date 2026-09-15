import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UnwatchRoomResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { UNWATCH_ROOM },
} = API_ENDPOINTS;

// Refused on a room you own. Remembered, so a later mention doesn't re-add you.
export const unwatchRoom = async (roomId: string): Promise<UnwatchRoomResponse> => {
  try {
    const response = await axiosInstance.post<UnwatchRoomResponse>(
      UNWATCH_ROOM.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to unwatch the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
