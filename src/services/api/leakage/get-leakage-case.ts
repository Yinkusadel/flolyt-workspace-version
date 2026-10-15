import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RevenueLeakCaseResponse } from "@/services/api/leakage/leakage-case-types";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: "refreshes lifecycle, audit, escalations, and verified value" — the poll/refresh route for
// an already-known case, e.g. after a Room close may have moved it to RESOLVED/INVALIDATED.

const {
  LEAKAGE: { GET_LEAKAGE_CASE },
} = API_ENDPOINTS;

export const getLeakageCase = async (caseId: string): Promise<RevenueLeakCaseResponse> => {
  try {
    const response = await axiosInstance.get<RevenueLeakCaseResponse>(GET_LEAKAGE_CASE.replace("{caseId}", caseId));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch this case");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
