import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface GetStageCohortsParams {
  /** 3-12, default 6. */
  months?: number;
}

// ❌ neither docs/endpoints/lifecycle.md nor the real spec's example specify the per-cohort row
// shape (both just name the field "cohorts", the spec's example even shows it as `null`) — typed
// loosely until a live response confirms it, don't invent fields.
export interface StageCohortsData {
  stageKey: string;
  stageName: string;
  cohorts: unknown[] | null;
  undatedCustomers: number;
  currency: string;
  valueCaveat: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetStageCohortsResponse {
  data: StageCohortsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_COHORTS },
} = API_ENDPOINTS;

export const getStageCohorts = async (
  stageKey: string,
  params?: GetStageCohortsParams
): Promise<GetStageCohortsResponse> => {
  try {
    const response = await axiosInstance.get<GetStageCohortsResponse>(
      GET_STAGE_COHORTS.replace("{stageKey}", stageKey),
      { params }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's cohorts");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
