import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { AiConversationMessage } from "@/features/ai-conversations/ai-conversation-types";

export interface AiConversationDetailDto {
  id: string;
  title: string;
  messages: AiConversationMessage[];
  createdAt: string;
  lastMessageAt: string;
  // Present per the v3 handoff's reconnect recipe: a non-null id means a run is queued/running/
  // awaiting_approval — fetch it via useGetAgentRun and, if still active, reopen its stream.
  activeRunId?: string | null;
}

export interface GetAiConversationByIdResponse {
  data: AiConversationDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_CONVERSATIONS: { GET_BY_ID },
} = API_ENDPOINTS;

export const getAiConversationById = async (
  id: string
): Promise<GetAiConversationByIdResponse> => {
  try {
    const response = await axiosInstance.get<GetAiConversationByIdResponse>(
      GET_BY_ID.replace("{id}", id)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch conversation");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
