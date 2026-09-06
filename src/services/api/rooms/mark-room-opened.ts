import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface MarkRoomOpenedResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { MARK_ROOM_OPENED },
} = API_ENDPOINTS;

// The only input the 30-day decay rule has. Idempotent and cheap: stamps at most once a day,
// writes nothing on repeat views same-day (data is false when there was nothing to stamp).
export const markRoomOpened = async (roomId: string): Promise<MarkRoomOpenedResponse> => {
  try {
    const response = await axiosInstance.post<MarkRoomOpenedResponse>(
      MARK_ROOM_OPENED.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to record that the room was opened");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
