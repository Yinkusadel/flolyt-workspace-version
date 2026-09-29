import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface AddRoomAgentPayload {
  roomId: string;
  agentKey: string;
  role: string;
  whatItWillDo: string;
  reads: string[] | null;
}

export interface AddRoomAgentResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { ADD_ROOM_AGENT },
} = API_ENDPOINTS;

// Exactly one agent may hold the `lead` role. `reads` is a statement of intent, not a grant.
export const addRoomAgent = async ({
  roomId,
  ...payload
}: AddRoomAgentPayload): Promise<AddRoomAgentResponse> => {
  try {
    const response = await axiosInstance.post<AddRoomAgentResponse>(
      ADD_ROOM_AGENT.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to add the agent to the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
