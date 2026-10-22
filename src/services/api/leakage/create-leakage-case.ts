import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RevenueLeakCaseResponse } from "@/services/api/leakage/leakage-case-types";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: `POST /cells/{cellId}/case` with `{ "dueAtUtc": null }` creates or returns the deterministic
// case — calling it twice on the same cell doesn't create a duplicate.

export interface CreateLeakageCasePayload {
  cellId: string;
  dueAtUtc: string | null;
}

const {
  LEAKAGE: { CREATE_LEAKAGE_CASE },
} = API_ENDPOINTS;

export const createLeakageCase = async ({ cellId, dueAtUtc }: CreateLeakageCasePayload): Promise<RevenueLeakCaseResponse> => {
  try {
    const response = await axiosInstance.post<RevenueLeakCaseResponse>(
      CREATE_LEAKAGE_CASE.replace("{cellId}", cellId),
      { dueAtUtc },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to create a case for this cell");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
