import axios from "axios";
import type { VerificationResultDto } from "@/services/api/rooms/get-room-verifications";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateRoomVerificationPayload {
  roomId: string;
  /** New UUID. Reuse it for transport retries; a new id for the same cohort/window never attributes twice. */
  id: string;
  planId: string;
  /** Required written review. */
  confounderReview: string;
}

export interface CreateRoomVerificationResponse {
  data: VerificationResultDto;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_ROOM_VERIFICATION },
} = API_ENDPOINTS;

// Reviewer must be an authorized administrator other than the intervention owner, author and
// source creator. The server reads evidence and computes the amounts; early or self review fails.
export const createRoomVerification = async ({ roomId, ...payload }: CreateRoomVerificationPayload): Promise<CreateRoomVerificationResponse> => {
  try {
    const response = await axiosInstance.post<CreateRoomVerificationResponse>(
      CREATE_ROOM_VERIFICATION.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to verify the result");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
