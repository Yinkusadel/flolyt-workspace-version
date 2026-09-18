import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SendInboxDraftResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { SEND_INBOX_DRAFT },
} = API_ENDPOINTS;

// Sending twice keeps the first send. Recipients are re-checked against the workspace at send
// time, not only at save time.
export const sendInboxDraft = async (messageId: string): Promise<SendInboxDraftResponse> => {
  try {
    const response = await axiosInstance.post<SendInboxDraftResponse>(
      SEND_INBOX_DRAFT.replace("{messageId}", messageId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to send the draft");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
