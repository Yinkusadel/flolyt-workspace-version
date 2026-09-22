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
  // Confirmed live 2026-09-22 — NOT a bare number as first typed; it's the same measured-value
  // wrapper as atStake/population, e.g. `{ value: null, state: "unavailable", missingSource: "…",
  // wouldUnlock: "…" }`.
  yearOverYear: LeakageMeasuredValueDto<number>;
}

export interface LeakageStageSeverityDto {
  currency: string;
  severity: LeakageSeverityLevelDto;
}

export interface LeakageRealizedAmountDto {
  currency: string;
  amount: number;
}

// Confirmed live 2026-09-22 — this is the same measured-value wrapper the old lifecycle domain
// used (`LifecycleMeasuredValueDto`), just under this domain's own name. Every distinctly-named
// figure that can independently be available or gapped (atStake, expected, population,
// departedThisMonth, movement, headline.yearOverYear) comes back as this exact 4-key shape — the
// wrapper itself is never null; only `.value` is.
export interface LeakageMeasuredValueDto<T> {
  value: T | null;
  state: string;
  missingSource?: string;
  wouldUnlock?: string;
}

// Confirmed live 2026-09-22 (`atStake.value = [{ currency: "NGN", amountAtRisk: 0 }]`) — field is
// `amountAtRisk`, not `amount`. Matches `formatAtStakeAmounts` in
// src/lib/format-measured-value.ts exactly, so that formatter can be reused as-is once this is
// wired.
export interface LeakageAtStakeAmountDto {
  currency: string;
  amountAtRisk: number;
}

// The outer wrapper (LeakageMeasuredValueDto) is confirmed live. This inner per-currency shape is
// still a guess, inferred from the endpoint's prose ("probability-weighted ... with an 80% range
// and a confidence tier") — every `expected` seen live so far was `state: "unavailable"`, so no
// real "available" example has been observed yet. Re-check once a workspace with a completed
// refresh is available.
export interface LeakageExpectedEntryDto {
  currency: string;
  amount: number;
  rangeLow: number;
  rangeHigh: number;
  confidence: string; // "low" | "medium" | "high", string on the wire
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
  atStake: LeakageMeasuredValueDto<LeakageAtStakeAmountDto[]>;
  expected: LeakageMeasuredValueDto<LeakageExpectedEntryDto[]>;
  severity: LeakageStageSeverityDto[];
  openRoomCount: number;
  population: LeakageMeasuredValueDto<number>;
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

// Still unconfirmed — a live pull of this endpoint (2026-09-22) returned `cells: []` for every
// grid (nothing has been measured for that workspace yet), so this truncated shape has not been
// re-checked. `amount`/`customers` are kept as plain nullable scalars (matching the original
// example, where they sit as bare siblings of `state`) rather than wrapped in
// LeakageMeasuredValueDto — but note that wrapper turned out to apply to *every* other
// independently-gappable figure in this API family, so treat that choice as a guess too. `expected`
// is wrapped on the same reasoning as the stage-level fix. Re-paste once a workspace with
// `coverage.measured > 0` is available.
export interface LeakageCellDto {
  row: string;
  condition: string;
  currency: string;
  state: string;
  amount: number | null;
  customers: number | null;
  expected: LeakageMeasuredValueDto<LeakageExpectedEntryDto>;
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
  // Confirmed live 2026-09-22 to be `null` (not just its sub-fields) when no market data exists
  // yet for the workspace — was typed as always-present.
  marketLens: LeakageMarketLensDto | null;
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
