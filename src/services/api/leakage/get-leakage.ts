import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// Shared across every leakage endpoint — this file is the canonical source, the way
// get-lifecycle-map.ts is for the old lifecycle domain.

export interface LeakageWindowDto {
  days: number;
  key: string;
  label: string;
  isPrecomputed: boolean;
  options: string[];
}

export interface LeakageHorizonDto {
  days: number;
  key: string;
  label: string;
  mode: string;
  modeNote: string | null;
  options: string[];
}

export interface LeakageSeverityLevelDto {
  level: string;
  label: string;
  cadence: string;
}

export interface LeakageSourceDto {
  id: string;
  name: string;
  kind: string;
  status: string;
}

export interface LeakageCalculationInputDto {
  label: string;
  value: string;
}

export interface LeakageCalculationDto {
  method: string;
  windowStartUtc: string | null;
  windowEndUtc: string | null;
  windowDays: number;
  sources: LeakageSourceDto[];
  inputs: LeakageCalculationInputDto[];
  caveats: string[];
}

export interface LeakageOwnerDto {
  ownerUserId: string;
  displayName: string;
  isActive: boolean;
}

export interface LeakageHeadlineDto {
  key: string;
  label: string;
  unit: string;
  value: number | null;
  missingSource: string | null;
  wouldUnlock: string | null;
  computedAtUtc: string | null;
  yearOverYear: number | null;
}

export interface LeakageStageSeverityDto {
  currency: string;
  severity: LeakageSeverityLevelDto;
}

export interface LeakageRealizedAmountDto {
  currency: string;
  amount: number;
}

// NOT confirmed against a real response — the pasted example returns bare `null` for every
// stage/cell/market's `atStake` and `expected`, so this is inferred from (a) the sibling
// `realized: LeakageRealizedAmountDto[]` field's shape and (b) "nothing is summed across
// currencies" being a stated rule of this endpoint. Re-paste with Scalar's "Show Schema" toggle
// to confirm before relying on these two shapes for anything load-bearing.
export interface LeakageAtStakeEntryDto {
  currency: string;
  amount: number;
}

// Inferred from the endpoint's own prose ("probability-weighted ... with an 80% range and a
// confidence tier — or a gap naming why no base rate exists"). Field names are a best guess, not
// confirmed — see the note on LeakageAtStakeEntryDto above.
export interface LeakageExpectedEntryDto {
  currency: string;
  amount: number | null;
  rangeLow: number | null;
  rangeHigh: number | null;
  confidence: string; // "low" | "medium" | "high", string on the wire
  gapReason: string | null;
}

export interface LeakageStageCardDto {
  key: string;
  name: string;
  position: number;
  owningTeam: string | null;
  owner: LeakageOwnerDto | null;
  leadAgentKey: string | null;
  leadAgentName: string | null;
  headline: LeakageHeadlineDto;
  atStake: LeakageAtStakeEntryDto[] | null;
  expected: LeakageExpectedEntryDto[] | null;
  severity: LeakageStageSeverityDto[];
  openRoomCount: number;
  population: number | null;
  calculation: LeakageCalculationDto;
  realized: LeakageRealizedAmountDto[];
}

export interface LeakageCalloutDto {
  key: string;
  tone: string;
  headline: string;
  body: string;
}

export interface LeakageMarketLensDto {
  countryCode: string;
  currencyCode: string;
  isPrimary: boolean;
}

export type LeakageConditionApplicability = "Unknown" | "Applies" | "NotApplicable";

export interface LeakageGridConditionDto {
  key: string;
  label: string;
  applicability: LeakageConditionApplicability;
  because: string;
  decidedBy: string;
}

export interface LeakageGridRowDto {
  key: string;
  label: string;
}

// The pasted example truncates this object after `roomId` (`"...": "[Additional Properties
// Truncated]"`) — there are more fields on a real cell than are typed here. Known from the cell
// detail panel (get-leakage-cell.ts) that at least a `reason`/`missingSource`/`wouldUnlock` gap
// trio exists for dashed cells; whether the grid response repeats those inline or the panel is
// the only place to get them is unconfirmed. Re-paste this response with Scalar's "Show Schema"
// toggle to fill in the rest.
export interface LeakageCellDto {
  row: string;
  condition: string;
  currency: string;
  state: string;
  amount: number | null;
  customers: number | null;
  expected: LeakageExpectedEntryDto | null;
  severity: LeakageSeverityLevelDto;
  intensity: number | null;
  roomId: string | null;
}

export interface LeakageGridDto {
  grid: string;
  rows: LeakageGridRowDto[];
  conditions: LeakageGridConditionDto[];
  cells: LeakageCellDto[];
}

export interface LeakageMarketConditionDto {
  key: string;
  label: string;
  amount: number;
  expected: LeakageExpectedEntryDto | null;
  severity: LeakageSeverityLevelDto;
  realized: number;
}

export interface LeakageMarketRailEntryDto {
  currency: string;
  countryCode: string | null;
  isPrimary: boolean;
  conditions: LeakageMarketConditionDto[];
}

export interface LeakageCoverageDto {
  measured: number;
  onMap: number;
  percent: number;
  measuredConditions: string[];
  unmeasuredConditions: string[];
  sentence: string;
}

export type LeakageCalculateMode = "gross" | "expected" | "net";

export interface LeakageFilterDto {
  calculate: string;
  minSeverity: string | null;
  minConfidence: string | null;
  cellsHidden: number;
}

export interface LeakageSeverityBandDto {
  level: string;
  label: string;
  cells: number;
  amount: number;
}

export interface LeakageBySeverityDto {
  currency: string;
  bands: LeakageSeverityBandDto[];
}

export interface LeakageLadderDto {
  currency: string;
  s1From: number;
  s2From: number;
  s3From: number;
}

export interface LeakagePageData {
  window: LeakageWindowDto;
  horizon: LeakageHorizonDto;
  refreshedAtUtc: string | null;
  customerCount: number;
  revenueModel: string | null;
  stages: LeakageStageCardDto[];
  callouts: LeakageCalloutDto[];
  marketLens: LeakageMarketLensDto;
  grids: LeakageGridDto[];
  markets: LeakageMarketRailEntryDto[];
  coverage: LeakageCoverageDto;
  filter: LeakageFilterDto;
  bySeverity: LeakageBySeverityDto[];
  ladders: LeakageLadderDto[];
  calculation: LeakageCalculationDto;
}

export interface GetLeakageParams {
  /** 30, 90, 180, 365, "qtd", or a number of days up to 365. Default 90. */
  window?: string | number;
  /** Country code — narrows the money to that market's currency. */
  market?: string;
  /** 30, 60, 90, "quarter", 365, or a number of days. Default 90. */
  horizon?: string | number;
  /** Default "gross". */
  calculate?: LeakageCalculateMode;
  minSeverity?: string;
  minConfidence?: string;
}

export interface GetLeakageResponse {
  data: LeakagePageData;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE },
} = API_ENDPOINTS;

export const getLeakage = async (params?: GetLeakageParams): Promise<GetLeakageResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageResponse>(GET_LEAKAGE, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the leakage page");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
