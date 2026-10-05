import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LeakageV2LimitationCode,
  LeakageV2LimitationOrigin,
  LeakageV2Publication,
} from "@/services/api/leakage/get-leakage";

// Added 2026-10-04 from the Phase 1-4 handoff. Not wired into a page yet.
// The drawer behind `limitationSummary`: opened from a readiness row (filtered by that row's
// limitation `code` when one exists) or from "all limitation details". Never parse the page's
// compatibility `limitations` strings instead of calling this. V2-only: fails when the workspace
// isn't enabled. The page response stays bounded even when thousands of diagnostics exist.

export interface LeakageLimitationDetail {
  code: LeakageV2LimitationCode;
  origin: LeakageV2LimitationOrigin;
  message: string;
  referenceType: string | null;
  referenceId: string | null;
  currency: string | null;
}

export interface LimitationDetailPage {
  contractVersion: "2.0";
  total: number;
  offset: number;
  limit: number;
  code: LeakageV2LimitationCode | null;
  items: LeakageLimitationDetail[];
  publication: LeakageV2Publication;
}

export interface GetLeakageLimitationsParams {
  /** Default 0. */
  offset?: number;
  /** 1-100, default 50. */
  limit?: number;
  code?: LeakageV2LimitationCode;
}

export interface GetLeakageLimitationsResponse {
  data: LimitationDetailPage;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_LIMITATIONS },
} = API_ENDPOINTS;

export const getLeakageLimitations = async (
  params?: GetLeakageLimitationsParams
): Promise<GetLeakageLimitationsResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageLimitationsResponse>(GET_LEAKAGE_LIMITATIONS, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the limitation details");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
