import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RevenueLeakCaseResponse } from "@/services/api/leakage/leakage-case-types";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: "sets a future date within 365 days and resets escalation" — the 365-day cap and
// future-only rule are server-enforced, not pre-validated here.

export interface UpdateLeakageCaseDueDatePayload {
  caseId: string;
  dueAtUtc: string;
  reason: string;
}

const {
  LEAKAGE: { UPDATE_LEAKAGE_CASE_DUE_DATE },
} = API_ENDPOINTS;

export const updateLeakageCaseDueDate = async ({
  caseId,
  dueAtUtc,
  reason,
}: UpdateLeakageCaseDueDatePayload): Promise<RevenueLeakCaseResponse> => {
  try {
    const response = await axiosInstance.put<RevenueLeakCaseResponse>(
      UPDATE_LEAKAGE_CASE_DUE_DATE.replace("{caseId}", caseId),
      { dueAtUtc, reason },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to set a new due date");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
