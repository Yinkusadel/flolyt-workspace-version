import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface MarkAllInboxReadResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { MARK_ALL_INBOX_READ },
} = API_ENDPOINTS;

export const markAllInboxRead = async (): Promise<MarkAllInboxReadResponse> => {
  try {
    const response = await axiosInstance.post<MarkAllInboxReadResponse>(MARK_ALL_INBOX_READ);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to mark the inbox read");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
