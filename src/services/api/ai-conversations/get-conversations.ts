import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type AiConversationScope = "Visible" | "Own" | "SharedWithMe";

export interface GetAiConversationsParams {
  pageNumber?: number;
  pageSize?: number;
  scope?: AiConversationScope;
}

export interface AiConversationSummaryDto {
  id: string;
  title: string;
  lastMessagePreview: string | null;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
  ownerUserId: string;
  ownerName: string | null;
  isOwn: boolean;
  visibility: string;
}

export interface GetAiConversationsResponse {
  data: AiConversationSummaryDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_CONVERSATIONS: { LIST },
} = API_ENDPOINTS;

export const getAiConversations = async (
  params?: GetAiConversationsParams
): Promise<GetAiConversationsResponse> => {
  try {
    const response = await axiosInstance.get<GetAiConversationsResponse>(LIST, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch AI conversations");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
