import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeleteRoomGuardrailPayload {
  roomId: string;
  key: string;
}

export interface DeleteRoomGuardrailResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REMOVE_ROOM_GUARDRAIL },
} = API_ENDPOINTS;

// Only the person who set it may remove it — no owner or administrator carve-out. A constraint
// somebody else can quietly remove is not one they set.
export const deleteRoomGuardrail = async ({
  roomId,
  key,
}: DeleteRoomGuardrailPayload): Promise<DeleteRoomGuardrailResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteRoomGuardrailResponse>(
      REMOVE_ROOM_GUARDRAIL.replace("{roomId}", roomId).replace("{key}", key)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to remove the guardrail");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
