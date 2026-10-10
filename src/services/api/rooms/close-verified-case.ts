import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CloseVerifiedCasePayload {
  roomId: string;
  verificationId: string;
  reason: string;
}

export interface CloseVerifiedCaseResponse {
  data: unknown;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CLOSE_VERIFIED_CASE },
} = API_ENDPOINTS;

// ❌ Shape not shown in the handoff (docs/rooms/revenue-threat-room-frontend-handoff.md); typed loosely until a real payload is seen.
// Closes only the verified case, never the Room. Needs a fresh confirmed measured-zero condition.
export const closeVerifiedCase = async ({ roomId, ...payload }: CloseVerifiedCasePayload): Promise<CloseVerifiedCaseResponse> => {
  try {
    const response = await axiosInstance.post<CloseVerifiedCaseResponse>(
      CLOSE_VERIFIED_CASE.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to close the verified case");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
