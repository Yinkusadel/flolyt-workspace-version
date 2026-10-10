import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type ThreatRoomOpeningState =
  | "PENDING"
  | "READY"
  | "PENDING_HUMAN_ROUTING"
  | "PENDING_LEGACY_REVIEW"
  | "BLOCKED"
  | "PAUSED";

export interface ThreatRoomOpeningData {
  state: ThreatRoomOpeningState;
  /** Why work is pending. Never show a ready collaboration Room before `READY`. */
  reason: string | null;
  roomId: string | null;
  conversationId: string | null;
  /** Attribute the automatic opening to Flolyt orchestration, not the assigned person. */
  systemActor: string | null;
  /** Audited ownership rule/fallback. Detail-level only, not the main answer. */
  routingReason: string | null;
  /** Immutable opening evidence plus scoped gross/expected/net estimates. Label as "estimated
   * exposure"; carry currency, market and lifecycle; never sum across currencies, subtract
   * Opportunity, or call findings customers/accounts. `calculations` keeps individual ranges;
   * `rangeAvailability=PER_CANDIDATE_NOT_AGGREGATED` does NOT authorize summing intervals.
   * ❌ Inner shape not shown in the handoff, typed loosely. */
  baseline: Record<string, unknown> | null;
  /** DRAFT next steps: proposed work, not approved or executed.
   * ❌ Inner shape not shown in the handoff, typed loosely. */
  plan: Record<string, unknown> | null;
}

export interface GetThreatRoomOpeningResponse {
  data: ThreatRoomOpeningData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_THREAT_ROOM_OPENING },
} = API_ENDPOINTS;

// A pending opening is not a global inbox item. Operators get investigation IDs from the
// triage/confirmation audit; a ready Room row supplies `threatConfirmationId` itself. 404 means
// missing, foreign or restricted.
export const getThreatRoomOpening = async (investigationId: string): Promise<GetThreatRoomOpeningResponse> => {
  try {
    const response = await axiosInstance.get<GetThreatRoomOpeningResponse>(GET_THREAT_ROOM_OPENING.replace("{investigationId}", investigationId));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the threat Room opening");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
