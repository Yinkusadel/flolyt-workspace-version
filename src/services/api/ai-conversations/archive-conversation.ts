import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface ArchiveAiConversationResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_CONVERSATIONS: { ARCHIVE },
} = API_ENDPOINTS;

export const archiveAiConversation = async (id: string): Promise<ArchiveAiConversationResponse> => {
  try {
    const response = await axiosInstance.delete<ArchiveAiConversationResponse>(ARCHIVE.replace("{id}", id));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to delete conversation");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
