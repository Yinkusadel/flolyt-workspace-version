import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetThreatOperatorMetricsParams {
  /** A completed half-open UTC window, at most 31 days. */
  fromUtc: string;
  toUtc: string;
}

export interface ThreatOperatorMetricsData {
  // ❌ Shape not shown in the handoff beyond `ledgerMovements` (corrections posted in the window,
  // not a lifetime balance) and per-currency series. Never sum across currencies; there is no
  // inferred false-positive rate or invented model cost.
  [key: string]: unknown;
}

export interface GetThreatOperatorMetricsResponse {
  data: ThreatOperatorMetricsData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_THREAT_OPERATOR_METRICS },
} = API_ENDPOINTS;

// Admin diagnostics. Counts decisions/attempts, not distinct businesses. Over 2,000 records in
// any series needs a narrower window.
export const getThreatOperatorMetrics = async (params?: GetThreatOperatorMetricsParams): Promise<GetThreatOperatorMetricsResponse> => {
  try {
    const response = await axiosInstance.get<GetThreatOperatorMetricsResponse>(GET_THREAT_OPERATOR_METRICS, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch operator metrics");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
