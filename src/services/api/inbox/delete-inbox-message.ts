import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeleteInboxMessageResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { DELETE_INBOX_MESSAGE },
} = API_ENDPOINTS;

// Yours alone. Idempotent — the row stays with isDeleted: true and an empty body.
export const deleteInboxMessage = async (
  messageId: string
): Promise<DeleteInboxMessageResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteInboxMessageResponse>(
      DELETE_INBOX_MESSAGE.replace("{messageId}", messageId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to delete the message");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
