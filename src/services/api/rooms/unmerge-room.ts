import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UnmergeRoomResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { UNMERGE_ROOM },
} = API_ENDPOINTS;

// Cheap, since merging moved nothing. The owner is NOT restored — reassigning is a separate act.
export const unmergeRoom = async (roomId: string): Promise<UnmergeRoomResponse> => {
  try {
    const response = await axiosInstance.post<UnmergeRoomResponse>(
      UNMERGE_ROOM.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to unmerge the room");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
