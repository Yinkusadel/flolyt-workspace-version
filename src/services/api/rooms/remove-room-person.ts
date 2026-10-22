import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RemoveRoomPersonPayload {
  roomId: string;
  userId: string;
}

export interface RemoveRoomPersonResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REMOVE_ROOM_PERSON },
} = API_ENDPOINTS;

// The owner cannot be removed this way — reassign the room first.
export const removeRoomPerson = async ({
  roomId,
  userId,
}: RemoveRoomPersonPayload): Promise<RemoveRoomPersonResponse> => {
  try {
    const response = await axiosInstance.delete<RemoveRoomPersonResponse>(
      REMOVE_ROOM_PERSON.replace("{roomId}", roomId).replace("{userId}", userId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to remove the person from the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
