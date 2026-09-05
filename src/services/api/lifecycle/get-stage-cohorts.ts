import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto, LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface GetStageCohortsParams {
  /** 3-12, default 6. */
  months?: number;
}

// Corrected 2026-09-05, confirmed live for `expand`: `cohorts` is ALSO the measured-value wrapper
// (`{value, state, missingSource, wouldUnlock}`) — same recurring bug class as get-stage-compare.ts
// had. Expand's live response came back unavailable (`missingSource`: "a definition for Expand —
// nothing yet says who enters it"), which confirms the wrapper but NOT the per-cohort row shape
// inside `.value` — that still isn't confirmed by any live response. `.value` is typed `unknown[]`
// until one is seen; don't invent fields on it. Per the 2026-09-04 spec's prose (not a concrete
// schema): each row should carry an arrival month, an `entered` measured value, one
// `stillInStageShare` cell per `measurementAgeDays` entry, and a `values` array of
// {currency, amount} observed-revenue-to-date figures — never at-stake, never a forecast.
export interface StageCohortsData {
  stageKey: string;
  stageName: string;
  /** Added 2026-09-04. [30, 60, 90] for most stages, [180] for expand/advocate/churn — confirmed live for expand. */
  measurementAgeDays: number[];
  cohorts: LifecycleMeasuredValueDto<unknown[]>;
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
