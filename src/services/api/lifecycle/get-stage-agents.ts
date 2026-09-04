import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

// The spec marks this as having additional properties beyond what's listed (truncated in the
// example), same pattern as leakage-map's cells — not treated as exhaustive.
export interface StageAgentConditionDto {
  id: string;
  label: string;
  metricKey: string;
  metricQuestion: string;
  unit: string;
  segment: string | null;
  comparison: string;
  threshold: number;
  sustainReadings: number;
  status: string;
  [key: string]: unknown;
}

export interface StageAgentDto {
  key: string;
  initials: string;
  name: string;
  /** "lead" for the stage's own agent, "supporting" for any other agent carrying a condition here. */
  role: string;
  /** ready | reading | not-ready — how an agent with nothing to read still appears at all. */
  readiness: string;
  reads: string[];
  needs: string | null;
  wouldUnlock: string | null;
  conditions: StageAgentConditionDto[];
}

export interface StageAgentFiringDto {
  id: string;
  conditionId: string;
  label: string;
  reading: number;
  threshold: number;
  outcome: string;
  routedVia: string;
  isTriage: boolean;
  roomId: string | null;
  note: string;
  firedAtUtc: string;
}

export interface StageAgentDisagreementDto {
  conflictId: string;
  roomId: string;
  raisedByAgent: string;
  summary: string;
  raisedAtUtc: string;
  /** Both conflicting agents' readings kept, never adjudicated here. */
  readings: string[];
}

export interface StageAgentsData {
  stageKey: string;
  stageName: string;
  agents: StageAgentDto[];
  /** Last 20. The unrouted count among these is the number that matters most. */
  recentFirings: StageAgentFiringDto[];
  disagreements: StageAgentDisagreementDto[];
  autoOpenRoomCap: number;
  autoOpenedRoomsOpen: number;
  callouts: LifecycleCalloutDto[];
}

export interface GetStageAgentsResponse {
  data: StageAgentsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_AGENTS },
} = API_ENDPOINTS;

export const getStageAgents = async (stageKey: string): Promise<GetStageAgentsResponse> => {
  try {
    const response = await axiosInstance.get<GetStageAgentsResponse>(
      GET_STAGE_AGENTS.replace("{stageKey}", stageKey)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's agents");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
