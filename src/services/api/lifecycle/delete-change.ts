import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeleteChangeResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { DELETE_CHANGE },
} = API_ENDPOINTS;

// Recorder can remove their own entry; a workspace administrator can remove any.
export const deleteChange = async (changeId: string): Promise<DeleteChangeResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteChangeResponse>(
      DELETE_CHANGE.replace("{changeId}", changeId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to remove the change");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
