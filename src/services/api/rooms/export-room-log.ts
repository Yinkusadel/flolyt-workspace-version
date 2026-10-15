import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

const {
  ROOMS: { EXPORT_ROOM_LOG },
} = API_ENDPOINTS;

// Every field quoted, since log text is human-written and routinely contains commas. This is a
// raw CSV file (FileStreamResult) — there is no { data, messages, succeeded } envelope here.
export const exportRoomLog = async (roomId: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.get<Blob>(EXPORT_ROOM_LOG.replace("{roomId}", roomId), {
      responseType: "blob",
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to export the room's log");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
