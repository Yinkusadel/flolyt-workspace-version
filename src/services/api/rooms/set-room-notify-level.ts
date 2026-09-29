import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SetRoomNotifyLevelPayload {
  roomId: string;
  /** "everything" | "decisions-only" | "nothing" */
  notifyLevel: string;
}

export interface SetRoomNotifyLevelResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { SET_ROOM_NOTIFY_LEVEL },
} = API_ENDPOINTS;

// Muting a room you own is refused — that's resigning from it, and somebody has to take it.
export const setRoomNotifyLevel = async ({
  roomId,
  notifyLevel,
}: SetRoomNotifyLevelPayload): Promise<SetRoomNotifyLevelResponse> => {
  try {
    const response = await axiosInstance.post<SetRoomNotifyLevelResponse>(
      SET_ROOM_NOTIFY_LEVEL.replace("{roomId}", roomId),
      { notifyLevel },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to set the notification level");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
