import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { InboxItemKind } from "@/services/api/inbox/get-inbox";

export interface MarkInboxReadPayload {
  kind: InboxItemKind;
  sourceId: string;
}

export interface MarkInboxReadResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { MARK_INBOX_READ },
} = API_ENDPOINTS;

// Keyed on kind + sourceId together, not sourceId alone — a line's group can change (an
// obligation escalating into NeedsYou) while what it is can't.
export const markInboxRead = async (
  payload: MarkInboxReadPayload
): Promise<MarkInboxReadResponse> => {
  try {
    const response = await axiosInstance.post<MarkInboxReadResponse>(MARK_INBOX_READ, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to mark the inbox item read");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
