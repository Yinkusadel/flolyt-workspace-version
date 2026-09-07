import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ReactivationWaveDto {
  campaignId: string;
  name: string;
  state: string;
  startedAtUtc: string | null;
  audience: number;
  holdout: number;
  dormantAtEnrolment: number;
  treatmentReactivationShare: number | null;
  holdoutReactivationShare: number | null;
  /** Only available when attribution === "holdout". */
  liftPoints: number | null;
  attribution: string;
  unattributableBecause: string | null;
  medianDaysSinceLastOrderAtEnrolment: number | null;
}

export interface RetainReactivationData {
  stageKey: string;
  stageName: string;
  basis: string;
  basisCaveat: string;
  dormancyDays: number;
  waves: ReactivationWaveDto[];
  campaignsConsidered: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetRetainReactivationResponse {
  data: RetainReactivationData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_RETAIN_REACTIVATION },
} = API_ENDPOINTS;

export const getRetainReactivation = async (): Promise<GetRetainReactivationResponse> => {
  try {
    const response = await axiosInstance.get<GetRetainReactivationResponse>(GET_RETAIN_REACTIVATION);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Retain's reactivation waves");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
