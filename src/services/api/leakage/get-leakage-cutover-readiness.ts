import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: "rollout/operator diagnostics" — not an end-user surface. "The frontend must not infer that
// legacy can be removed from v2ReadSelected; readyToRetireLegacy is the final gate and remains
// false until dependency, SLO, rollback, Room, and explicit approval evidence exists." No literal
// TS block given in the doc — fields below are named directly from its prose, not a schema; confirm
// live before building any UI on top of this (and this route is unlikely to need one at all, per
// its own "operator diagnostics" framing).

export interface LeakageCutoverReadiness {
  v2ReadSelected: boolean;
  readyToRetireLegacy: boolean;
  readBlockers: string[];
  retirementBlockers: string[];
  activeRoomsWithoutV2Alias: number;
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
