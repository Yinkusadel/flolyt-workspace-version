import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface DeclineConveningProposalPayload {
  proposalId: string;
  why: string;
}

export interface DeclineConveningProposalResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { DECLINE_CONVENING_PROPOSAL },
} = API_ENDPOINTS;

// The decline is kept, not deleted — a category declined every time is a row that shouldn't be on
// the map, and that's only legible if the declines survive with their reasons. One proposal per
// detector fingerprint, ever — nothing is suggested twice.
export const declineConveningProposal = async ({
  proposalId,
  why,
}: DeclineConveningProposalPayload): Promise<DeclineConveningProposalResponse> => {
  try {
    const response = await axiosInstance.post<DeclineConveningProposalResponse>(
      DECLINE_CONVENING_PROPOSAL.replace("{proposalId}", proposalId),
      { why },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to decline the convening proposal");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
