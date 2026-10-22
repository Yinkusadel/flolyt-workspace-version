import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RevenueLeakCaseResponse, RevenueLeakCaseStatus } from "@/services/api/leakage/leakage-case-types";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: "Resolving requires evidence. The client must never submit VERIFIED." — `VERIFIED` is
// excluded from `target`'s type below so that rule is enforced at compile time, not just by
// convention; the existing outcome-verification job is the only thing that ever sets it.

export type LeakageCaseTransitionTarget = Exclude<RevenueLeakCaseStatus, "VERIFIED">;

export interface TransitionLeakageCasePayload {
  caseId: string;
  target: LeakageCaseTransitionTarget;
  reason: string;
  evidenceReferences: string[];
}

const {
  LEAKAGE: { TRANSITION_LEAKAGE_CASE },
} = API_ENDPOINTS;

export const transitionLeakageCase = async ({
  caseId,
  target,
  reason,
  evidenceReferences,
}: TransitionLeakageCasePayload): Promise<RevenueLeakCaseResponse> => {
  try {
    const response = await axiosInstance.post<RevenueLeakCaseResponse>(
      TRANSITION_LEAKAGE_CASE.replace("{caseId}", caseId),
      { target, reason, evidenceReferences },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to advance this case");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
