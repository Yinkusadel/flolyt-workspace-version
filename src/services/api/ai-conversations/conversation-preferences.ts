import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { ConversationReplyMode } from "@/features/ai-conversations/ai-conversation-types";

export interface ConversationPreferencesResponse {
  data: { replyMode: ConversationReplyMode };
  messages: string[];
  succeeded: boolean;
}

const {
  AI_CONVERSATIONS: { PREFERENCES },
} = API_ENDPOINTS;

/** The caller's own saved reply mode for a conversation (`auto` when nothing is saved). 404 when inaccessible. */
export const getConversationPreferences = async (conversationId: string): Promise<ConversationPreferencesResponse> => {
  try {
    const response = await axiosInstance.get<ConversationPreferencesResponse>(
      PREFERENCES.replace("{id}", conversationId)
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to load the reply mode");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};

/** Saves the caller's reply mode. Creates no message, run or notification; 400 for an invalid mode. */
export const setConversationPreferences = async ({
  conversationId,
  replyMode,
}: {
  conversationId: string;
  replyMode: ConversationReplyMode;
}): Promise<ConversationPreferencesResponse> => {
  try {
    const response = await axiosInstance.put<ConversationPreferencesResponse>(
      PREFERENCES.replace("{id}", conversationId),
      { replyMode }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to save the reply mode");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
