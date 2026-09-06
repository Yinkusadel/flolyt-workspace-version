import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ChurnSignalDto {
  key: string;
  name: string;
  /** Prevalence among departures, not a fitted weight. */
  precededShare: number | null;
  leadTimeDays: number | null;
  customersTripping: number | null;
}

export interface ChurnPredictionData {
  stageKey: string;
  stageName: string;
  basis: string;
  basisCaveat: string;
  lapsedCustomers: number;
  /** There is no fused risk score, deliberately — signals are named individually. */
  signals: ChurnSignalDto[];
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetChurnPredictionResponse {
  data: ChurnPredictionData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_CHURN_PREDICTION },
} = API_ENDPOINTS;

export const getChurnPrediction = async (): Promise<GetChurnPredictionResponse> => {
  try {
    const response = await axiosInstance.get<GetChurnPredictionResponse>(GET_CHURN_PREDICTION);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Churn's prediction signals");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
