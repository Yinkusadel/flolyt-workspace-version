import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface AddRoomPersonPayload {
  roomId: string;
  userId: string;
  role: string;
  maxApprovalReach: number | null;
  source: string | null;
}

export interface AddRoomPersonResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { ADD_ROOM_PERSON },
} = API_ENDPOINTS;

// The widest of the available options and should be presented as such — they'll see evidence,
// decision, plays, and every customer in the cohort.
export const addRoomPerson = async ({
  roomId,
  ...payload
}: AddRoomPersonPayload): Promise<AddRoomPersonResponse> => {
  try {
    const response = await axiosInstance.post<AddRoomPersonResponse>(
      ADD_ROOM_PERSON.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to add the person to the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
