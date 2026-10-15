import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateInboxDraftPayload {
  messageId: string;
  body: string;
  roomId?: string | null;
}

export interface UpdateInboxDraftResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { UPDATE_INBOX_DRAFT },
} = API_ENDPOINTS;

// Your own, and only while it's still a draft — a sent message can't change under somebody who's
// already read it.
export const updateInboxDraft = async ({
  messageId,
  ...payload
}: UpdateInboxDraftPayload): Promise<UpdateInboxDraftResponse> => {
  try {
    const response = await axiosInstance.put<UpdateInboxDraftResponse>(
      UPDATE_INBOX_DRAFT.replace("{messageId}", messageId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the draft");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
