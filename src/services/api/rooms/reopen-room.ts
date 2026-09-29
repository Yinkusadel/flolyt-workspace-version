import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ReopenRoomPayload {
  roomId: string;
  why: string;
  ownerMemberId: string | null;
}

export interface ReopenRoomResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REOPEN_ROOM },
} = API_ENDPOINTS;

// The id doesn't change, so every link ever pasted still resolves. The previous opening is kept
// whole; the working surfaces (log, evidence, decision, plays) start empty. Population is
// re-read from the cell as it stands now, not carried forward.
export const reopenRoom = async ({
  roomId,
  ...payload
}: ReopenRoomPayload): Promise<ReopenRoomResponse> => {
  try {
    const response = await axiosInstance.post<ReopenRoomResponse>(
      REOPEN_ROOM.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to reopen the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
