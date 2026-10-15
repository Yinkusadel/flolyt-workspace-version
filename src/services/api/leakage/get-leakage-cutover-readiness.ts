import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// Scaffolded 2026-10-01 from doc prose, corrected 2026-10-02 against the real Scalar schema the
// user pasted — the prose-only version was missing `contractVersion`, `hasActivePublication`,
// `publishedSnapshots`, `rollbackAvailable`, and `retirementApproved` entirely. "Rollout/operator
// diagnostics" per the doc — not an end-user surface. "The frontend must not infer that legacy can
// be removed from v2ReadSelected; readyToRetireLegacy is the final gate and remains false until
// dependency, SLO, rollback, Room, and explicit approval evidence exists." Still unlikely to ever
// need a UI, per the doc's own framing — fixed for correctness, not because it's planned.

export interface LeakageCutoverReadiness {
  contractVersion: string;
  v2ReadSelected: boolean;
  hasActivePublication: boolean;
  publishedSnapshots: number;
  activeRoomsWithoutV2Alias: number;
  rollbackAvailable: boolean;
  retirementApproved: boolean;
  readyForDefaultV2Read: boolean;
  readyToRetireLegacy: boolean;
  readBlockers: string[];
  retirementBlockers: string[];
}

export interface GetLeakageCutoverReadinessResponse {
  data: LeakageCutoverReadiness;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CUTOVER_READINESS },
} = API_ENDPOINTS;

export const getLeakageCutoverReadiness = async (): Promise<GetLeakageCutoverReadinessResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageCutoverReadinessResponse>(GET_LEAKAGE_CUTOVER_READINESS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch cutover readiness");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
