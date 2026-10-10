import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateVerificationPlanPayload {
  roomId: string;
  /** Client-generated UUID, the idempotency key. Generate once per user intent and reuse on retry. */
  id: string;
  /** "campaign_holdout" or "source_condition_review"; anything else cannot claim value. */
  method: string;
  /** Campaign UUID for campaign_holdout; may be an empty string for source_condition_review. */
  sourceId: string;
  /** Whole UTC days. At most 90 days long, starting within 30. */
  fromUtc: string;
  toUtc: string;
}

export interface CreateVerificationPlanResponse {
  data: unknown;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { CREATE_VERIFICATION_PLAN },
} = API_ENDPOINTS;

// ❌ Shape not shown in the handoff (docs/rooms/revenue-threat-room-frontend-handoff.md); typed loosely until a real payload is seen.
// Registration is the start of the intervention period: all treatment dispatch must follow it and
// precede `fromUtc`. Owner or administrator only.
export const createVerificationPlan = async ({ roomId, ...payload }: CreateVerificationPlanPayload): Promise<CreateVerificationPlanResponse> => {
  try {
    const response = await axiosInstance.post<CreateVerificationPlanResponse>(
      CREATE_VERIFICATION_PLAN.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to register the verification plan");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
