import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { AiProposalDecisionResult } from "./get-ai-proposals";

export interface RejectAiProposalResponse {
  data: AiProposalDecisionResult;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_PROPOSALS: { REJECT },
} = API_ENDPOINTS;

export const rejectAiProposal = async (id: string): Promise<RejectAiProposalResponse> => {
  try {
    const response = await axiosInstance.post<RejectAiProposalResponse>(REJECT.replace("{id}", id));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to reject the proposal");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
