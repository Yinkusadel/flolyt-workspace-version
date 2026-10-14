import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type ResolutionPlanActionKind =
  | "HUMAN_ACTION"
  | "AGENT_PROPOSAL"
  | "TOOL_ACTION"
  | "DATA_REMEDIATION"
  | "WAIT_AND_MONITOR";

export interface ResolutionPlanAction {
  id: string;
  kind: ResolutionPlanActionKind;
  description: string;
  ownerId: string;
  expectedCompletionUtc: string;
  successCriterion: string;
  /** Action ids in the same revision. Must be acyclic. */
  dependsOn: string[];
  /** Required for AGENT_PROPOSAL and TOOL_ACTION; must exist in this Room's conversation. */
  proposalId?: string | null;
  /** Optional; must belong to this Room and the action owner. */
  obligationId?: string | null;
}

export interface ResolutionPlanBody {
  diagnosis: string;
  objective: string;
  successCriteria: string;
  verificationPlan: string;
  actions: ResolutionPlanAction[];
}

export interface ReviseRoomResolutionPlanPayload extends ResolutionPlanBody {
  roomId: string;
  /** From the last GET. A stale value fails: reload before editing. */
  expectedRevision: number;
}

export interface ReviseRoomResolutionPlanResponse {
  data: unknown;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REVISE_ROOM_RESOLUTION_PLAN },
} = API_ENDPOINTS;

// ❌ Shape not shown in the handoff (docs/rooms/revenue-threat-room-frontend-handoff.md); typed loosely until a real payload is seen.
// Revising never approves a proposal or runs a tool; those go through their existing APIs.
export const reviseRoomResolutionPlan = async ({ roomId, ...payload }: ReviseRoomResolutionPlanPayload): Promise<ReviseRoomResolutionPlanResponse> => {
  try {
    const response = await axiosInstance.put<ReviseRoomResolutionPlanResponse>(
      REVISE_ROOM_RESOLUTION_PLAN.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to revise the resolution plan");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
