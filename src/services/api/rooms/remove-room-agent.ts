import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RemoveRoomAgentPayload {
  roomId: string;
  agentKey: string;
}

export interface RemoveRoomAgentResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REMOVE_ROOM_AGENT },
} = API_ENDPOINTS;

// The arbiter cannot be removed — without one, a room settles disagreements by whichever agent
// spoke last.
export const removeRoomAgent = async ({
  roomId,
  agentKey,
}: RemoveRoomAgentPayload): Promise<RemoveRoomAgentResponse> => {
  try {
    const response = await axiosInstance.delete<RemoveRoomAgentResponse>(
      REMOVE_ROOM_AGENT.replace("{roomId}", roomId).replace("{agentKey}", agentKey)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to remove the agent from the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
