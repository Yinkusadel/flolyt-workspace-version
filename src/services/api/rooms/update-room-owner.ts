import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateRoomOwnerPayload {
  roomId: string;
  ownerMemberId: string;
}

export interface UpdateRoomOwnerResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { UPDATE_ROOM_OWNER },
} = API_ENDPOINTS;

// Refused on an archived room — ownership of finished work is a matter of record, not reassignable.
export const updateRoomOwner = async ({
  roomId,
  ownerMemberId,
}: UpdateRoomOwnerPayload): Promise<UpdateRoomOwnerResponse> => {
  try {
    const response = await axiosInstance.put<UpdateRoomOwnerResponse>(
      UPDATE_ROOM_OWNER.replace("{roomId}", roomId),
      { ownerMemberId },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to hand off the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
