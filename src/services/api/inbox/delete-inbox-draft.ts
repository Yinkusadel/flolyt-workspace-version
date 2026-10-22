import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeleteInboxDraftResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { DELETE_INBOX_DRAFT },
} = API_ENDPOINTS;

// Your own, and only while unsent.
export const deleteInboxDraft = async (messageId: string): Promise<DeleteInboxDraftResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteInboxDraftResponse>(
      DELETE_INBOX_DRAFT.replace("{messageId}", messageId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to delete the draft");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
