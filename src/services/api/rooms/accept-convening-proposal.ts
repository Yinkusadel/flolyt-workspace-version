import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface AcceptConveningProposalResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { ACCEPT_CONVENING_PROPOSAL },
} = API_ENDPOINTS;

// Any member may accept — the proposal already chose an owner from stage ownership, and the room
// opens in that owner's name, not the accepter's. Can refuse: the leakage map moves every fifteen
// minutes, so the cell is re-read rather than opening a room on a figure that's since gone.
export const acceptConveningProposal = async (
  proposalId: string
): Promise<AcceptConveningProposalResponse> => {
  try {
    const response = await axiosInstance.post<AcceptConveningProposalResponse>(
      ACCEPT_CONVENING_PROPOSAL.replace("{proposalId}", proposalId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to accept the convening proposal");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
