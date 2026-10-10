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

export interface ResolutionPlanActionStatus {
  actionId: string;
  /** Render from here, never from an action description or a plan revision. */
  proposalState: string | null;
  obligationState: string | null;
  /** False means the plan needs review. */
  ownerAvailable: boolean;
  /** False means the plan needs review. Forced false when `obligationOwnerMismatch` is true. */
  referencesAvailable: boolean;
  /** True means the linked obligation was reassigned; the historical action owner is unchanged. */
  obligationOwnerMismatch: boolean;
}

export interface ResolutionPlanData {
  contractVersion: string;
  /** 0 for a Phase 5 Room with no typed plan yet (its owner can create the first revision). */
  revision: number;
  plan: ResolutionPlanBody | null;
  // ❌ The exact property holding the live status rows is not named in the handoff. Confirm the
  // name against a real response; `actionStatuses` is a placeholder.
  actionStatuses?: ResolutionPlanActionStatus[];
}

export interface GetRoomResolutionPlanResponse {
  data: ResolutionPlanData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_RESOLUTION_PLAN },
} = API_ENDPOINTS;

// Each revision is a separate immutable record. No plan value is verified revenue and the
// opening baseline never changes.
export const getRoomResolutionPlan = async (roomId: string): Promise<GetRoomResolutionPlanResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomResolutionPlanResponse>(GET_ROOM_RESOLUTION_PLAN.replace("{roomId}", roomId));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the resolution plan");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
