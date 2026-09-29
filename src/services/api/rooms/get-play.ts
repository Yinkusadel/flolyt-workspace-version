import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface PlayMeasurementPlanDto {
  holdoutPercent: number | null;
  noHoldoutBecause: string | null;
  measuredOverDays: number;
  primaryMeasure: string;
  revenueBasis: string;
}

export interface PlayFalsifierDto {
  condition: string;
  thenWhat: string;
  addedAtUtc: string;
  metAtUtc: string | null;
}

export interface PlayGuardrailDto {
  key: string;
  label: string;
  setting: string;
  setByLabel: string;
}

export interface PlayDissentDto {
  id: string;
  wording: string;
  byUserId: string;
  byLabel: string;
  recordedAtUtc: string;
  withdrawn: boolean;
  borneOut: boolean | null;
}

export interface PlayDetailData {
  proposalId: string;
  roomId: string | null;
  roomTitle: string | null;
  conversationId: string | null;
  summary: string;
  toolName: string;
  rationale: string | null;
  proposedByAgentKey: string | null;
  proposedByAgentName: string | null;
  proposedAtUtc: string;
  state: string;
  decisionOwnerMemberId: string;
  decisionOwnerName: string | null;
  waitingHours: number | null;
  decidedBy: string | null;
  decidedByLabel: string | null;
  decidedAtUtc: string | null;
  deferredBecause: string | null;
  reach: number | null;
  effect: number | null;
  currency: string | null;
  figuresAreStated: boolean;
  plannedSendAtUtc: string | null;
  audienceSegmentId: string | null;
  argumentsJson: string;
  finalArgumentsJson: string | null;
  executionResultJson: string | null;
  campaignId: string | null;
  /** What's changed since the play was described, or null. Non-null means approving now answers a different question than the card that was shown. */
  drift: string | null;
  /** True means a sent message can't be recalled after delivery. */
  reachesCustomers: boolean;
  measurement: PlayMeasurementPlanDto;
  ifItFails: PlayFalsifierDto[];
  guardrails: PlayGuardrailDto[];
  dissent: PlayDissentDto[];
}

export interface GetPlayResponse {
  data: PlayDetailData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_PLAY },
} = API_ENDPOINTS;

// The approval screen. 404 for a play that doesn't exist, is in another workspace, or sits in a
// restricted room the caller can't see — deliberately the same answer for all three.
export const getPlay = async (proposalId: string): Promise<GetPlayResponse> => {
  try {
    const response = await axiosInstance.get<GetPlayResponse>(
      GET_PLAY.replace("{proposalId}", proposalId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the play");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
