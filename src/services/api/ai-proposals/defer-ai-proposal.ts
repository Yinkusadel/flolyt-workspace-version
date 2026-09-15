import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { AiProposalDecisionResult } from "./get-ai-proposals";

export interface DeferAiProposalParams {
  id: string;
  because: string;
}

export interface DeferAiProposalResponse {
  data: AiProposalDecisionResult;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_PROPOSALS: { DEFER },
} = API_ENDPOINTS;

// Not a reject — the objection stays on the record whether or not it turns out right, so
// `because` is required rather than optional.
export const deferAiProposal = async ({
  id,
  because,
}: DeferAiProposalParams): Promise<DeferAiProposalResponse> => {
  try {
    const response = await axiosInstance.post<DeferAiProposalResponse>(
      DEFER.replace("{id}", id),
      { because }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to defer the proposal");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
