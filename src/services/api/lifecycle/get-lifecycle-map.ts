import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LifecycleStageOwnerDto {
  ownerUserId: string;
  displayName: string;
  isActive: boolean;
}

// Confirmed 2026-08-31 from a real GET /lifecycle/map response — atStake and population are NOT
// bare nullable numbers, they're this richer wrapper. missingSource/wouldUnlock are only present
// when state is "unavailable" (omitted entirely, not null, when available). The written doc
// description had simplified this away to "atStake: number | null" — don't trust that shape for
// any other field in this domain described as "unavailable and says why" without checking a real
// response first; this wrapper is likely reused for primaryConversion, observedValue,
// reachability, rateOfChange, delta, change/changePercent etc. across the other lifecycle
// endpoints, but that's inferred, not confirmed per-field.
export interface LifecycleMeasuredValueDto<T> {
  value: T | null;
  state: string;
  missingSource?: string;
  wouldUnlock?: string;
}

// Added 2026-09-04 from the fresh spec — the map card's one always-present figure. 6 of 10
// stages compute this today (new customers, repeat share, order-problem-then-lapsed customers,
// plans in use, plans up-for-renewal); the other 4 are declared but gated, never computed on the
// request path. yearOverYear compares the SAME MONTH a year ago as a share of where it started
// (a flow-vs-flow comparison) — refuses when the headline's own definition changed in between.
export interface LifecycleHeadlineDto {
  key: string;
  label: string;
  unit: string;
  value: number | null;
  missingSource: string | null;
  wouldUnlock: string | null;
  computedAtUtc: string | null;
  yearOverYear: LifecycleMeasuredValueDto<number> | null;
}

export interface LifecycleReferralReachDto {
  referred: number | null;
  shareOfAcquisition: number | null;
  newCustomers: number | null;
  windowDays: number;
}

export interface LifecycleStageDto {
  key: string;
  name: string;
  position: number;
  headline: LifecycleHeadlineDto;
  owningTeam: string | null;
  owner: LifecycleStageOwnerDto | null;
  leadAgentKey: string | null;
  leadAgentName: string | null;
  reviewCadence: string | null;
  // Confirmed 2026-09-04 against the real spec text: real values only for activate/retain/churn —
  // the other 7 stages always carry missingSource/wouldUnlock instead of a value. See
  // docs/endpoints/lifecycle.md's GET /map entry for why the 2026-08-31 note claiming otherwise
  // was a misread of its own evidence.
  atStake: LifecycleMeasuredValueDto<number>;
  /** A true zero, unlike the other figures here — rooms are opened on a leakage cell, so a stage with nothing measurable cannot have one. */
  openRoomCount: number;
  population: LifecycleMeasuredValueDto<number>;
  populationSource: string | null;
  definitionVersion: number | null;
  populationComputedAtUtc: string | null;
  populationCaveat: string | null;
}

export interface LifecycleCalloutDto {
  key: string;
  tone: string;
  headline: string;
  body: string;
}

export interface LifecycleMarketLensDto {
  countryCode: string;
  currencyCode: string;
  isPrimary: boolean;
}

export interface LifecycleMapData {
  stages: LifecycleStageDto[];
  callouts: LifecycleCalloutDto[];
  marketLens: LifecycleMarketLensDto | null;
  /** Added 2026-09-04. Advocate-specific in practice; presumably null for other stages, unconfirmed live. */
  referralReach: LifecycleReferralReachDto | null;
}

export interface GetLifecycleMapResponse {
  data: LifecycleMapData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_MAP },
} = API_ENDPOINTS;

export const getLifecycleMap = async (): Promise<GetLifecycleMapResponse> => {
  try {
    const response = await axiosInstance.get<GetLifecycleMapResponse>(GET_MAP);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the lifecycle map");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
