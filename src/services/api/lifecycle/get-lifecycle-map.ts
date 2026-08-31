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

export interface LifecycleStageDto {
  key: string;
  name: string;
  position: number;
  owningTeam: string | null;
  owner: LifecycleStageOwnerDto | null;
  leadAgentKey: string | null;
  leadAgentName: string | null;
  reviewCadence: string | null;
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
