import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateRoomPersonPayload {
  roomId: string;
  userId: string;
  role: string;
  maxApprovalReach: number | null;
}

export interface UpdateRoomPersonResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { UPDATE_ROOM_PERSON },
} = API_ENDPOINTS;

// Visibility never changes — it never was tied to role.
export const updateRoomPerson = async ({
  roomId,
  userId,
  ...payload
}: UpdateRoomPersonPayload): Promise<UpdateRoomPersonResponse> => {
  try {
    const response = await axiosInstance.put<UpdateRoomPersonResponse>(
      UPDATE_ROOM_PERSON.replace("{roomId}", roomId).replace("{userId}", userId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the room member");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
