import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RevenueLeakCaseResponse } from "@/services/api/leakage/leakage-case-types";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: assigns an active workspace member. "A non-admin can assign only themselves" — a server-
// side rule, not something to pre-validate client-side (the error response is the source of truth).

export interface UpdateLeakageCaseOwnerPayload {
  caseId: string;
  ownerUserId: string;
  reason: string;
}

const {
  LEAKAGE: { UPDATE_LEAKAGE_CASE_OWNER },
} = API_ENDPOINTS;

export const updateLeakageCaseOwner = async ({
  caseId,
  ownerUserId,
  reason,
}: UpdateLeakageCaseOwnerPayload): Promise<RevenueLeakCaseResponse> => {
  try {
    const response = await axiosInstance.put<RevenueLeakCaseResponse>(
      UPDATE_LEAKAGE_CASE_OWNER.replace("{caseId}", caseId),
      { ownerUserId, reason },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to reassign this case");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
