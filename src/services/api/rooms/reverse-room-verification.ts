import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ReverseRoomVerificationPayload {
  roomId: string;
  verificationId: string;
  reason: string;
}

export interface ReverseRoomVerificationResponse {
  data: unknown;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REVERSE_ROOM_VERIFICATION },
} = API_ENDPOINTS;

// ❌ Shape not shown in the handoff (docs/rooms/revenue-threat-room-frontend-handoff.md); typed loosely until a real payload is seen.
// Append-only: the original stays readable. Refetch both verification and case views afterwards,
// since a previously closed case returns to resolved.
export const reverseRoomVerification = async ({ roomId, ...payload }: ReverseRoomVerificationPayload): Promise<ReverseRoomVerificationResponse> => {
  try {
    const response = await axiosInstance.post<ReverseRoomVerificationResponse>(
      REVERSE_ROOM_VERIFICATION.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to reverse the verification");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
