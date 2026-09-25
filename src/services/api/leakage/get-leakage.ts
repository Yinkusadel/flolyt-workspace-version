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

// Confirmed live 2026-09-24 against a workspace with a connected source and real coverage — the
// 2026-09-22 truncated paste was missing six fields entirely (`reason`/`missingSource`/
// `wouldUnlock`/`neverEstimated`/`calculation`/`realized`), all real and populated on the grid's
// own inline cell, not just the click-through detail. `amount`/`customers`/`intensity` stay plain
// nullable scalars (not `LeakageMeasuredValueDto`, unlike the rest of this API family) — confirmed
// by a real measured cell (`state: "available"`, `amount: 7023.98`, `customers: 24`,
// `intensity: 1`) sitting right next to gap ones (`state: "unavailable"`, every other field null,
// `reason: "NotMeasuredByFlolyt"`). A real zero is genuinely `state: "available"`, `amount: 0`, not
// a gap — confirmed live, matches `measured = amount != null`. `calculation`/`realized` are
// populated only when measured (`null` on a gap cell).
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
  /** Confirmed live value so far: "NotMeasuredByFlolyt" (a different literal than the click-through
   * detail's own `reason`, which only ever showed "SourceMissing") — plain string, not an enum. */
  reason: string | null;
  missingSource: string | null;
  wouldUnlock: string | null;
  neverEstimated: boolean;
  calculation: LeakageCalculationDto | null;
  realized: number | null;
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
