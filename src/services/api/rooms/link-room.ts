import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LinkRoomPayload {
  roomId: string;
  otherRoomId: string;
  why: string;
}

export interface LinkRoomResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { LINK_ROOM },
} = API_ENDPOINTS;

// NOT a merge — both rooms keep their own owner, decision, and close; the link is written into
// both rooms.
export const linkRoom = async ({
  roomId,
  ...payload
}: LinkRoomPayload): Promise<LinkRoomResponse> => {
  try {
    const response = await axiosInstance.post<LinkRoomResponse>(
      LINK_ROOM.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to link the rooms");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
