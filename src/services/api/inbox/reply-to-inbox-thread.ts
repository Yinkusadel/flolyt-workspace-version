import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ReplyToInboxThreadPayload {
  threadId: string;
  body: string;
  asDraft?: boolean;
  roomId?: string | null;
}

export interface ReplyToInboxThreadResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { REPLY_TO_INBOX_THREAD },
} = API_ENDPOINTS;

// Recipients are the thread itself, not chosen here — whoever was addressed or has spoken gets
// it, minus whoever's replying.
export const replyToInboxThread = async ({
  threadId,
  ...payload
}: ReplyToInboxThreadPayload): Promise<ReplyToInboxThreadResponse> => {
  try {
    const response = await axiosInstance.post<ReplyToInboxThreadResponse>(
      REPLY_TO_INBOX_THREAD.replace("{threadId}", threadId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to send the reply");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
