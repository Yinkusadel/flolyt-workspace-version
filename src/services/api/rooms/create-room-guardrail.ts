import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateRoomGuardrailPayload {
  roomId: string;
  label: string;
  setting: string;
}

export interface CreateRoomGuardrailResponse {
  // ❌ docs/endpoints/rooms.md's prose says this returns the key needed to lift the guardrail,
  // but the live example response shows `data: null` — typed nullable until a real call confirms
  // which is right.
  data: string | null;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_ROOM_GUARDRAIL },
} = API_ENDPOINTS;

// Any member may add one — the person who knows why a discount is wrong isn't always the owner.
// Stated, not enforced: nothing in the send pipeline reads a room guardrail yet, since plays
// aren't room-scoped.
export const createRoomGuardrail = async ({
  roomId,
  ...payload
}: CreateRoomGuardrailPayload): Promise<CreateRoomGuardrailResponse> => {
  try {
    const response = await axiosInstance.post<CreateRoomGuardrailResponse>(
      CREATE_ROOM_GUARDRAIL.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to add the guardrail");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
