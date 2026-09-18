import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type InboxItemKind =
  | "Proposal"
  | "Assignment"
  | "Investigation"
  | "Obligation"
  | "Finished"
  | "Notification"
  | "Message"
  | "Mention";

export interface GetInboxParams {
  filter?: "All" | "Unread" | "Mentions" | "Approvals";
}

export interface InboxItemDto {
  group: string;
  kind: InboxItemKind;
  sourceId: string;
  isRead: boolean;
  mentionsYou: boolean;
  actorLabel: string;
  summary: string;
  context: string | null;
  occurredAtUtc: string;
  roomId: string | null;
  href: string | null;
  eventCount: number;
}

export interface InboxGroupCount {
  group: string;
  count: number;
}

export interface InboxData {
  items: InboxItemDto[];
  counts: InboxGroupCount[];
  unread: number;
  total: number;
}

export interface GetInboxResponse {
  data: InboxData;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { GET_INBOX },
} = API_ENDPOINTS;

export const getInbox = async (params?: GetInboxParams): Promise<GetInboxResponse> => {
  try {
    const response = await axiosInstance.get<GetInboxResponse>(GET_INBOX, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the inbox");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
