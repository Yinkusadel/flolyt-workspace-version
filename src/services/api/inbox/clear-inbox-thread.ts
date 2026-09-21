import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ClearInboxThreadResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { CLEAR_INBOX_THREAD },
} = API_ENDPOINTS;

// Yours alone — a watermark on your own overlay, not a delete of anybody's messages.
export const clearInboxThread = async (threadId: string): Promise<ClearInboxThreadResponse> => {
  try {
    const response = await axiosInstance.post<ClearInboxThreadResponse>(
      CLEAR_INBOX_THREAD.replace("{threadId}", threadId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to clear the conversation");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
