import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { InboxItemKind } from "@/services/api/inbox/get-inbox";

export interface SnoozeInboxItemPayload {
  kind: InboxItemKind;
  sourceId: string;
  untilUtc: string | null;
}

export interface SnoozeInboxItemResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { SNOOZE_INBOX_ITEM },
} = API_ENDPOINTS;

// untilUtc: null (or a time already past) un-snoozes immediately. Capped at 90 days ahead by the
// backend — further than that isn't a snooze, it's hiding the line.
export const snoozeInboxItem = async (
  payload: SnoozeInboxItemPayload
): Promise<SnoozeInboxItemResponse> => {
  try {
    const response = await axiosInstance.post<SnoozeInboxItemResponse>(
      SNOOZE_INBOX_ITEM,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to snooze the inbox item");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
