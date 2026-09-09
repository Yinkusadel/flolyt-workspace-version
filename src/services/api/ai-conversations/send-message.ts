import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SendAiMessagePayload {
  /** null starts a new conversation. */
  conversationId: string | null;
  message: string;
  /** Optional surface-mode passthrough. */
  mode?: string | null;
  /** Answers to a prior `input_request` event. */
  interactiveReply?: Record<string, string> | null;
}

export interface ReasoningStepDto {
  phase: string;
  description: string;
  dataSource: string | null;
  querySummary: string | null;
  timestamp: string;
}

export interface SuggestedActionDto {
  type: string;
  label: string;
  payload: Record<string, string> | null;
}

export interface AgentMessageResultDto {
  conversationId: string;
  response: string;
  reasoningSteps: ReasoningStepDto[];
  suggestedActions: SuggestedActionDto[];
  workflow: Record<string, unknown> | null;
}

export interface SendAiMessageResponse {
  data: AgentMessageResultDto;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_CONVERSATIONS: { SEND_MESSAGE },
} = API_ENDPOINTS;

// Non-streaming mode — Accept: application/json returns one complete AgentMessageResult
// instead of an SSE stream. See docs/chat-panel/agent-hardening-frontend-design.md §3.1.
export const sendAiMessage = async (
  payload: SendAiMessagePayload
): Promise<SendAiMessageResponse> => {
  try {
    const response = await axiosInstance.post<SendAiMessageResponse>(SEND_MESSAGE, payload, {
      headers: { Accept: "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to send message");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
