import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RevenueLeakCaseResponse } from "@/services/api/leakage/leakage-case-types";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: appends a decision to the case's `decisions[]` log — distinct from a lifecycle transition.

export interface AddLeakageCaseDecisionPayload {
  caseId: string;
  decision: string;
  reason: string;
}

const {
  LEAKAGE: { ADD_LEAKAGE_CASE_DECISION },
} = API_ENDPOINTS;

export const addLeakageCaseDecision = async ({
  caseId,
  decision,
  reason,
}: AddLeakageCaseDecisionPayload): Promise<RevenueLeakCaseResponse> => {
  try {
    const response = await axiosInstance.post<RevenueLeakCaseResponse>(
      ADD_LEAKAGE_CASE_DECISION.replace("{caseId}", caseId),
      { decision, reason },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to record this decision");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
