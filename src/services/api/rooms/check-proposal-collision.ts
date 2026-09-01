import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomCollisionOtherRoomDto {
  roomId: string | null;
  roomTitle: string | null;
  restricted: boolean;
  overlap: number;
  theirSendAtUtc: string | null;
  ourSendAtUtc: string | null;
  gapHours: number | null;
  /** would-breach | same-window | clear | unscheduled */
  verdict: string;
}

export interface ProposalCollisionData {
  total: number;
  colliding: number;
  wouldBreach: boolean;
  clear: boolean;
  others: RoomCollisionOtherRoomDto[];
  notResolvable: number;
}

export interface CheckProposalCollisionResponse {
  data: ProposalCollisionData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CHECK_PROPOSAL_COLLISION },
} = API_ENDPOINTS;

// Checked workspace-wide (a per-room check would let two rooms each believe they're clear).
// POST because the answer must never be cached.
export const checkProposalCollision = async (
  roomId: string,
  proposalId: string
): Promise<CheckProposalCollisionResponse> => {
  try {
    const response = await axiosInstance.post<CheckProposalCollisionResponse>(
      CHECK_PROPOSAL_COLLISION.replace("{roomId}", roomId).replace("{proposalId}", proposalId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to check for a send collision");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
