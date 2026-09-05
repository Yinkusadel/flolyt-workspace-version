import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LifecycleCalloutDto,
  LifecycleMeasuredValueDto,
  LifecycleReferralReachDto,
  LifecycleStageOwnerDto,
} from "@/services/api/lifecycle/get-lifecycle-map";

export interface StageDepartureClaimDto {
  statement: string;
  grade: string;
  /** Added 2026-09-04, not in the original pass. */
  type: string;
  confidence: number;
}

// Added 2026-09-04. Compares two periods the same way GET .../compare does, scoped to this one
// departure cause.
export interface StageDepartureTrendDto {
  direction: string | null;
  reading: number | null;
  shareChange: number | null;
  countChange: number | null;
  monthsCompared: number;
  missingSource: string | null;
}

export interface StageDepartureDto {
  cause: string;
  toStageKey: string | null;
  toStageName: string | null;
  conditionKey: string | null;
  size: number | null;
  observedValue: number | null;
  observedValueCaveat: string | null;
  reachability: string | null;
  reachabilityCaveat: string | null;
  claim: StageDepartureClaimDto;
  roomOpen: boolean;
  /** Added 2026-09-04. */
  trend: StageDepartureTrendDto;
}

// Added 2026-09-04.
export interface StageOwnershipStandingDto {
  ownerUserId: string | null;
  unownedSinceUtc: string | null;
  unownedMonths: number | null;
  reason: string | null;
  isOwned: boolean;
}

export interface StageData {
  stageKey: string;
  stageName: string;
  position: number;
  owningTeam: string | null;
  leadAgentKey: string | null;
  leadAgentName: string | null;
  reviewCadence: string | null;
  // Corrected 2026-09-04 — confirmed live 2026-08-31 (acquire/activate responses) that these are
  // the same measured-value wrapper GET /map's atStake uses, not bare `number | null`.
  population: LifecycleMeasuredValueDto<number>;
  populationSource: string | null;
  definitionVersion: number | null;
  populationComputedAtUtc: string | null;
  populationCaveat: string | null;
  rateOfChange: LifecycleMeasuredValueDto<number>;
  /** Added 2026-09-04. This month vs the same month a year ago, as a share of where it started. */
  yearOverYear: LifecycleMeasuredValueDto<number>;
  /** Added 2026-09-04. Set when the stage's definition changed inside the comparison year. */
  yearOverYearCaveat: string | null;
  primaryConversion: LifecycleMeasuredValueDto<number>;
  /** Added 2026-09-04. Decided by the same code GET /map uses — real value only for activate/retain/churn. */
  atStake: LifecycleMeasuredValueDto<number>;
  departures: StageDepartureDto[];
  restating: boolean;
  callouts: LifecycleCalloutDto[];
  /** Added 2026-09-04. Advocate-specific in practice. */
  referralReach: LifecycleReferralReachDto | null;
  /** Added 2026-09-04. */
  owner: LifecycleStageOwnerDto | null;
  /** Added 2026-09-04. */
  ownershipStanding: StageOwnershipStandingDto;
}

export interface GetStageResponse {
  data: StageData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE },
} = API_ENDPOINTS;

export const getStage = async (stageKey: string): Promise<GetStageResponse> => {
  try {
    const response = await axiosInstance.get<GetStageResponse>(GET_STAGE.replace("{stageKey}", stageKey));

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
