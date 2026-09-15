import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateChangeFromRoomPayload {
  roomId: string;
  occurredOnUtc: string;
  title?: string;
  affectedStageKeys?: string[];
}

export interface CreateChangeFromRoomResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { CREATE_CHANGE_FROM_ROOM },
} = API_ENDPOINTS;

// One promotion per room opening — a reopened room's new decision is a new change.
export const createChangeFromRoom = async (
  payload: CreateChangeFromRoomPayload
): Promise<CreateChangeFromRoomResponse> => {
  try {
    const response = await axiosInstance.post<CreateChangeFromRoomResponse>(
      CREATE_CHANGE_FROM_ROOM,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to promote the room's decision to a change");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
