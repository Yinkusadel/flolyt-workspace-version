import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetAiProposalsParams {
  conversationId?: string;
  includeDecided?: boolean;
}

export interface AiProposalDto {
  id: string;
  conversationId: string | null;
  runId: string | null;
  toolName: string;
  argumentsJson: string;
  finalArgumentsJson: string | null;
  status: string;
  decidedBy: string | null;
  decidedAtUtc: string | null;
  executionResultJson: string | null;
  createdAtUtc: string;
}

export interface GetAiProposalsResponse {
  data: AiProposalDto[];
  messages: string[];
  succeeded: boolean;
}

export interface AiProposalDecisionResult {
  proposalId: string;
  status: string;
  executionResultJson: string | null;
}

const {
  AI_PROPOSALS: { LIST },
} = API_ENDPOINTS;

export const getAiProposals = async (
  params?: GetAiProposalsParams
): Promise<GetAiProposalsResponse> => {
  try {
    const response = await axiosInstance.get<GetAiProposalsResponse>(LIST, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch proposals");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
