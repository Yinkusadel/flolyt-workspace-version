import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetRoomVerificationsParams {
  plansPage?: number;
  resultsPage?: number;
  /** Default 25, maximum 100. */
  pageSize?: number;
  /** Retain the returned value while following both next* cursors; refetch page 1 to refresh. */
  asOfUtc?: string;
}

export type VerificationStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "UNVERIFIED"
  | "FAILED";

export interface VerificationResultDto {
  id: string;
  planId: string;
  status: VerificationStatus;
  observedIncrementalReceipts: number | null;
  /** The only accepted value. The point estimate and exposure delta are not value. */
  acceptedAmount: number | null;
  currency: string | null;
  method: string;
  methodVersion: string;
  reviewer: string | null;
  scope: Record<string, unknown> | null;
  window: { fromUtc: string; toUtc: string } | null;
  /** Count only; raw subject inputs are never returned. */
  measuredSubjects: number;
  /** Capped at 20. */
  evidenceReferences: unknown[];
  evidenceReferenceCount: number;
  qualifications: string[];
  // ❌ How a reversal is attached to its original is not specified ("matching append-only
  // reversals"); the field name below is a placeholder. A reversal overrides its original's
  // display; never sum both as positive.
  reversal?: Record<string, unknown> | null;
}

export interface VerificationPlanDto {
  id: string;
  method: string;
  methodVersion: string;
  sourceId: string;
  fromUtc: string;
  toUtc: string;
  /** Null means this verification cannot support procedure learning (no lesson). */
  boundResolutionPlanId: string | null;
  boundResolutionPlanRevision: number | null;
}

export interface RoomVerificationsData {
  plans: VerificationPlanDto[];
  results: VerificationResultDto[];
  asOfUtc: string;
  nextPlansPage: number | null;
  nextResultsPage: number | null;
}

export interface GetRoomVerificationsResponse {
  data: RoomVerificationsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_VERIFICATIONS },
} = API_ENDPOINTS;

// ❌ Wrapper property names (`plans`, `results`) are inferred from the handoff's prose and need
// confirming against a real response.
export const getRoomVerifications = async (roomId: string, params?: GetRoomVerificationsParams): Promise<GetRoomVerificationsResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomVerificationsResponse>(GET_ROOM_VERIFICATIONS.replace("{roomId}", roomId), { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch verifications");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
