import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { InboxThreadRoomDto } from "@/services/api/inbox/get-inbox-thread";

export interface InboxSentItemDto {
  threadId: string;
  to: string[];
  summary: string;
  roomId: string | null;
  room: InboxThreadRoomDto | null;
  messageCount: number;
  lastFromYou: string;
  lastAtUtc: string;
}

export interface GetInboxSentResponse {
  data: InboxSentItemDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { GET_INBOX_SENT },
} = API_ENDPOINTS;

// Not part of the `GET /inbox` list — that's filtered to recipients, so a thread you started was
// otherwise readable only by its route and listed nowhere for its own sender. `to` is who was
// addressed (off the conversation, not the last message), and `lastFromYou` vs `lastAtUtc`
// differing is what answers "did they reply and I haven't been back."
export const getInboxSent = async (): Promise<GetInboxSentResponse> => {
  try {
    const response = await axiosInstance.get<GetInboxSentResponse>(GET_INBOX_SENT);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch sent messages");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
