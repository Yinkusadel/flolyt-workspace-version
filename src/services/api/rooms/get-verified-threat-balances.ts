import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetVerifiedThreatBalancesParams {
  /** Cursor from the previous page's `nextCursor`. */
  after?: string;
}

export interface VerifiedThreatBalancesData {
  // ❌ Partition fields not shown in the handoff. Keep each market/currency/lifecycle/value-kind
  // partition separate; never build a global FX-less total.
  partitions: Record<string, unknown>[];
  nextCursor: string | null;
}

export interface GetVerifiedThreatBalancesResponse {
  data: VerifiedThreatBalancesData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_VERIFIED_THREAT_BALANCES },
} = API_ENDPOINTS;

// Admin only, 100 partitions per page. Excludes existing stated Room claims.
// ❌ The `partitions` property name is inferred and needs confirming against a real response.
export const getVerifiedThreatBalances = async (params?: GetVerifiedThreatBalancesParams): Promise<GetVerifiedThreatBalancesResponse> => {
  try {
    const response = await axiosInstance.get<GetVerifiedThreatBalancesResponse>(GET_VERIFIED_THREAT_BALANCES, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch verified threat balances");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
