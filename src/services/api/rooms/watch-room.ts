import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WatchRoomPayload {
  roomId: string;
  reason?: string | null;
  notifyLevel?: string | null;
}

export interface WatchRoomResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { WATCH_ROOM },
} = API_ENDPOINTS;

// Somebody who previously unwatched is not re-added by an automatic reason (a mention or a
// rule) — but an explicit call to this endpoint does add them back.
export const watchRoom = async ({
  roomId,
  ...payload
}: WatchRoomPayload): Promise<WatchRoomResponse> => {
  try {
    const response = await axiosInstance.post<WatchRoomResponse>(
      WATCH_ROOM.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to watch the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
