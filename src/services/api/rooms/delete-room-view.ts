import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeleteRoomViewResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { DELETE_ROOM_VIEW },
} = API_ENDPOINTS;

// Author only — deleting someone else's would break every link anybody has to it.
export const deleteRoomView = async (viewId: string): Promise<DeleteRoomViewResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteRoomViewResponse>(
      DELETE_ROOM_VIEW.replace("{viewId}", viewId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to delete the view");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
