import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface BacktestStageConditionPayload {
  stageKey: string;
  metricKey: string;
  comparison: "AtOrBelow" | "AtOrAbove";
  threshold: number;
  sustainReadings: number;
  segment?: string | null;
}

export interface BacktestPointDto {
  periodStartUtc: string;
  reading: number | null;
  breaching: boolean;
  wouldHaveFired: boolean;
}

export interface BacktestStageConditionData {
  stageKey: string;
  stageName: string;
  metricKey: string;
  metricQuestion: string;
  threshold: number;
  sustainReadings: number;
  /** Unavailable, naming that, for a current-state metric with no stored series. */
  firings: number | null;
  /** "month" — the live sustain window is counted in daily readings, a coarser test than the rule. */
  grain: string | null;
  points: BacktestPointDto[];
  caveat: string | null;
}

export interface BacktestStageConditionResponse {
  data: BacktestStageConditionData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { BACKTEST_STAGE_CONDITION },
} = API_ENDPOINTS;

export const backtestStageCondition = async ({
  stageKey,
  ...payload
}: BacktestStageConditionPayload): Promise<BacktestStageConditionResponse> => {
  try {
    const response = await axiosInstance.post<BacktestStageConditionResponse>(
      BACKTEST_STAGE_CONDITION.replace("{stageKey}", stageKey),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to backtest the condition");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
