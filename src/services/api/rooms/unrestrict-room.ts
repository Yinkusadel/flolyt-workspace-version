import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UnrestrictRoomResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { UNRESTRICT_ROOM },
} = API_ENDPOINTS;

export const unrestrictRoom = async (roomId: string): Promise<UnrestrictRoomResponse> => {
  try {
    const response = await axiosInstance.delete<UnrestrictRoomResponse>(
      UNRESTRICT_ROOM.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to open the room back up");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
