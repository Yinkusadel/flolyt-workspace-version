import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ChurnReasonDto {
  key: string;
  label: string;
  customers: number | null;
  share: number | null;
  attribution: string;
  /** Set for "never activated"/"stopped after repeating" — Churn records the loss, another stage causes it. */
  upstreamStage: string | null;
}

export interface ChurnReasonsData {
  stageKey: string;
  stageName: string;
  basis: string;
  basisCaveat: string;
  lapsedCustomers: number;
  reasons: ChurnReasonDto[];
  /** The residual — never distributed across the counted rows. */
  unexplainedCustomers: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetChurnReasonsResponse {
  data: ChurnReasonsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_CHURN_REASONS },
} = API_ENDPOINTS;

export const getChurnReasons = async (): Promise<GetChurnReasonsResponse> => {
  try {
    const response = await axiosInstance.get<GetChurnReasonsResponse>(GET_CHURN_REASONS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Churn's reasons");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
