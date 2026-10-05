import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { InboxThreadRoomDto } from "@/services/api/inbox/get-inbox-thread";

export interface InboxDraftDto {
  messageId: string;
  threadId: string;
  to: string[];
  body: string;
  roomId: string | null;
  room: InboxThreadRoomDto | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface GetInboxDraftsResponse {
  data: InboxDraftDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { GET_INBOX_DRAFTS },
} = API_ENDPOINTS;

// Yours alone, most recently edited first, unwindowed (unlike the rest of the inbox) — a draft is
// something you made and can delete, so it shouldn't quietly disappear after 90 days the way the
// rest of the inbox's windows do. Previously the "no way to list your own drafts" gap that kept
// step 8 of the inbox rebuild blocked — see docs/inbox/build-plan.md.
export const getInboxDrafts = async (): Promise<GetInboxDraftsResponse> => {
  try {
    const response = await axiosInstance.get<GetInboxDraftsResponse>(GET_INBOX_DRAFTS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch drafts");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
