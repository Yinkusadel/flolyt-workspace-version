import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateInboxMessagePayload {
  messageId: string;
  body: string;
  roomId?: string | null;
}

export interface UpdateInboxMessageResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { UPDATE_INBOX_MESSAGE },
} = API_ENDPOINTS;

// Yours alone, and only a message that's been sent — a draft is revised through the drafts route.
export const updateInboxMessage = async ({
  messageId,
  ...payload
}: UpdateInboxMessagePayload): Promise<UpdateInboxMessageResponse> => {
  try {
    const response = await axiosInstance.put<UpdateInboxMessageResponse>(
      UPDATE_INBOX_MESSAGE.replace("{messageId}", messageId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the message");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
