import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RestrictRoomPayload {
  roomId: string;
  /** "pricing-before-announcement" | "individual-employment" | "active-legal-matter" | "acquisition" */
  reason: string;
}

export interface RestrictRoomResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { RESTRICT_ROOM },
} = API_ENDPOINTS;

// Fixed reason list, by design. The room stays LISTED — name, reason, who restricted it, and
// headcount inside remain visible to everyone.
export const restrictRoom = async ({
  roomId,
  reason,
}: RestrictRoomPayload): Promise<RestrictRoomResponse> => {
  try {
    const response = await axiosInstance.post<RestrictRoomResponse>(
      RESTRICT_ROOM.replace("{roomId}", roomId),
      { reason },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to restrict the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
