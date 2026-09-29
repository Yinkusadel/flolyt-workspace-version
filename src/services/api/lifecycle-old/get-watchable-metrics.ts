import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WatchableMetricDto {
  key: string;
  question: string;
  unit: string;
  /** The metric is meaningless unsliced (e.g. needs a departure or currency named). */
  needsSegmentation: boolean;
  /** A stored series exists to backtest against. */
  hasHistory: boolean;
  readsFrom: string;
}

export interface GetWatchableMetricsResponse {
  /** A bare array, not wrapped under a data object. */
  data: WatchableMetricDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_WATCHABLE_METRICS },
} = API_ENDPOINTS;

// Deliberately a small fixed catalog, not a formula language — a metric can be refused at
// authoring time when it can't be read.
export const getWatchableMetrics = async (): Promise<GetWatchableMetricsResponse> => {
  try {
    const response = await axiosInstance.get<GetWatchableMetricsResponse>(GET_WATCHABLE_METRICS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the watchable metrics");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
