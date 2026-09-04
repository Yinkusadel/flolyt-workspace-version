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
// loosely until a live response confirms it, don't invent fields. Per the 2026-09-04 spec's prose
// (not yet a concrete schema): each row should carry an arrival month, an `entered` measured
// value, one `stillInStageShare` cell per `measurementAgeDays` entry, and a `values` array of
// {currency, amount} observed-revenue-to-date figures — never at-stake, never a forecast.
export interface StageCohortsData {
  stageKey: string;
  stageName: string;
  /** Added 2026-09-04. [30, 60, 90] for most stages, [180] for expand/advocate/churn per the prose — unconfirmed live. */
  measurementAgeDays: number[];
  cohorts: unknown[] | null;
  undatedCustomers: number | null;
  valueCaveat: string | null;
  /** Added 2026-09-04. */
  caveat: string | null;
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
