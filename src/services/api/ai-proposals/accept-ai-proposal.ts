import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

import type { AiProposalDecisionResult } from "./get-ai-proposals";

export interface AcceptAiProposalParams {
  id: string;
  editedArgumentsJson?: string | null;
}

export interface AcceptAiProposalResponse {
  data: AiProposalDecisionResult;
  messages: string[];
  succeeded: boolean;
}

const {
  AI_PROPOSALS: { ACCEPT },
} = API_ENDPOINTS;

// Reviewing the card is the approval — no step-up code. What runs is exactly what was on the
// card unless editedArgumentsJson is sent; a send whose audience/time moved since proposing is
// refused server-side rather than silently running on stale numbers.
export const acceptAiProposal = async ({
  id,
  editedArgumentsJson,
}: AcceptAiProposalParams): Promise<AcceptAiProposalResponse> => {
  try {
    const response = await axiosInstance.post<AcceptAiProposalResponse>(
      ACCEPT.replace("{id}", id),
      { editedArgumentsJson: editedArgumentsJson ?? null }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to accept the proposal");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
