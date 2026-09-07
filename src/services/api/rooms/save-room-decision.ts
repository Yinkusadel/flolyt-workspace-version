import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SaveRoomDecisionPayload {
  roomId: string;
  summary: string;
  draftedByLabel?: string;
  guardrails?: string;
  statement?: string;
}

export interface SaveRoomDecisionResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { SAVE_ROOM_DECISION },
} = API_ENDPOINTS;

// Revisions are append-only and each must state what it changed. Omitting a section leaves it
// as-is, doesn't blank it.
export const saveRoomDecision = async ({
  roomId,
  ...payload
}: SaveRoomDecisionPayload): Promise<SaveRoomDecisionResponse> => {
  try {
    const response = await axiosInstance.post<SaveRoomDecisionResponse>(
      SAVE_ROOM_DECISION.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to save the decision");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
