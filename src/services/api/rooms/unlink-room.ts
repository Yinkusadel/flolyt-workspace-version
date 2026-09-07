import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UnlinkRoomPayload {
  roomId: string;
  otherRoomId: string;
}

export interface UnlinkRoomResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { UNLINK_ROOM },
} = API_ENDPOINTS;

// Not a claim the two never overlapped — says they're no longer being worked as related.
export const unlinkRoom = async ({
  roomId,
  otherRoomId,
}: UnlinkRoomPayload): Promise<UnlinkRoomResponse> => {
  try {
    const response = await axiosInstance.delete<UnlinkRoomResponse>(
      UNLINK_ROOM.replace("{roomId}", roomId).replace("{otherRoomId}", otherRoomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to unlink the rooms");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
