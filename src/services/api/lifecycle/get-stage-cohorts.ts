import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto, LifecycleMeasuredValueDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface GetStageCohortsParams {
  /** 3-12, default 6. */
  months?: number;
}

export interface StageCohortValueDto {
  currency: string;
  amount: number;
  /** amount ÷ entered, provided by the API — null whenever entered is 0 (nothing to divide by). */
  perCustomer: number | null;
}

export interface StageCohortAgeDto {
  ageDays: number;
  stillInStageShare: LifecycleMeasuredValueDto<number>;
}

export interface StageCohortRowDto {
  /** The arrival month, e.g. "2026-08-01T00:00:00+00:00". */
  periodStartUtc: string;
  entered: LifecycleMeasuredValueDto<number>;
  /** One entry per currency, never summed. `state`/`value` wrap the whole array, not each entry. */
  values: LifecycleMeasuredValueDto<StageCohortValueDto[]>;
  ages: StageCohortAgeDto[];
}

// Corrected 2026-09-05, confirmed live for `expand` (unavailable) then `activate`/`retain` (real
// rows): `cohorts` is the measured-value wrapper (`{value, state, missingSource, wouldUnlock}`),
// same recurring bug class as get-stage-compare.ts had — `.value` holds the row array below when
// available. `stillInStageShare` reads unavailable throughout for both live responses seen so
// far, confirmed exactly as the spec's prose predicted: a lifecycle-bridged stage (no explicit
// definition) records where a customer is *now*, not where they stood at 30/60/90 days, so every
// age cell is unavailable naming that. An `entered`/`values.amount` of 0 is a real "available"
// measurement (the pass ran and found nobody that month), not a missing one — confirmed live,
// never render a null/unavailable state for a genuine zero.
export interface StageCohortsData {
  stageKey: string;
  stageName: string;
  /** [30, 60, 90] for most stages, [180] for expand/advocate/churn — confirmed live for both. */
  measurementAgeDays: number[];
  cohorts: LifecycleMeasuredValueDto<StageCohortRowDto[]>;
  undatedCustomers: number | null;
  valueCaveat: string | null;
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
