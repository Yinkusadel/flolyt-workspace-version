import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DecideRoomDecisionPayload {
  roomId: string;
  summary: string;
  statement?: string;
}

export interface DecideRoomDecisionResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { DECIDE_ROOM_DECISION },
} = API_ENDPOINTS;

// Deciding resolves nothing — recorded dissent stays exactly as it was. Only the eventual
// close-result settles an objection.
export const decideRoomDecision = async ({
  roomId,
  ...payload
}: DecideRoomDecisionPayload): Promise<DecideRoomDecisionResponse> => {
  try {
    const response = await axiosInstance.post<DecideRoomDecisionResponse>(
      DECIDE_ROOM_DECISION.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to mark the decision made");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
