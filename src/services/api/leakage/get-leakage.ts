import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LeakageCoverageExplanation,
  LeakageExecutive,
} from "@/services/api/leakage/leakage-executive-types";

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

// ===== V2 (dual-contract) types — confirmed live 2026-10-01 against a real published snapshot,
// see docs/leakage-map/v2-build-plan.md's Step 0 for the full diff against the handoff doc. These
// are additive: `GET /leakage` returns one or the other depending on the backend's own
// `RevenueIntelligence:LeakageV2:ReadRollout` flag + whether a V2 snapshot has been published for
// the company, never both. The V1 types above are untouched and still drive every legacy response.

export interface LeakageV2ControlOption {
  value: string;
  label: string;
}

/** How a market option relates to the workspace's own market settings (confirmed live 2026-10-05). */
export type LeakageV2MarketOptionState =
  | "CONFIGURED_AND_OBSERVED"
  | "CONFIGURED_NOT_OBSERVED"
  | "OBSERVED_NOT_CONFIGURED"
  | "UNASSIGNED";

/**
 * One option per matrix market, including markets seen in the data but absent from workspace settings.
 * `currency` is a deprecated alias of `preferredCurrency`: a preference only, never a currency
 * restriction and never to be applied as a filter automatically. `currencies` lists the currencies
 * known for the market, not a claim that others are invalid. A configured market that is not observed
 * is not a zero exposure. Added 2026-10-05 (registry 1.6.0).
 */
export interface LeakageV2MarketOption {
  market: string;
  /** Deprecated alias of `preferredCurrency`; null for the Unassigned bucket. */
  currency: string | null;
  preferredCurrency: string | null;
  currencies: string[];
  isPrimary: boolean;
  isConfigured: boolean;
  isObserved: boolean;
  hasExposure: boolean;
  state: LeakageV2MarketOptionState;
}

export interface LeakageV2Controls {
  mode: string;
  horizonDays: number;
  horizon: string;
  market: string | null;
  /** Added 2026-10-04. Filters denomination; `market` filters attribution, neither substitutes. */
  currency: string | null;
  sector: string | null;
  severity: string | null;
  confidence: string | null;
  lifecycleClass: string | null;
  modes: LeakageV2ControlOption[];
  horizons: LeakageV2ControlOption[];
  markets: string[];
  currencies: string[];
  /** Render the market control from this, keeping the market/currency pair. */
  marketOptions: LeakageV2MarketOption[];
  /** Display context only: never permission to convert or merge local-currency values. */
  reportingCurrency: string | null;
  sectors: string[];
  severities: string[];
  confidenceLevels: string[];
  lifecycleClasses: string[];
}

export interface LeakageV2Publication {
  runId: string;
  snapshotId: string;
  asOfUtc: string;
  builtAtUtc: string;
  publishedAtUtc: string;
  registryVersion: string;
  sectorProfileVersions: string[];
}

export type LeakageV2DisplayState = "POPULATED" | "UNKNOWN" | "NO_EXPOSURE" | "HIDDEN_BY_FILTER";
export type LeakageV2DisplayFacet = "COMPOUND";
export type LeakageV2Availability =
  | "AVAILABLE"
  | "PARTIALLY_AVAILABLE"
  | "AVAILABLE_BUT_STALE"
  | "AVAILABLE_BUT_UNMAPPED"
  | "AVAILABLE_BUT_LOW_QUALITY"
  | "PERMISSION_BLOCKED"
  | "SOURCE_DEGRADED"
  | "NOT_AVAILABLE";

export interface LeakageV2Range {
  status: "UNAVAILABLE" | "EMPIRICAL" | "CALIBRATED" | "ASSUMPTION";
  lower: number | null;
  upper: number | null;
  basis: string | null;
  version: string | null;
  probabilityMass: number | null;
}

/**
 * Confirmed live 2026-10-01 — `mode`/`lifecycleClass`/`severity` all come back UPPERCASE
 * ("GROSS", "IN_FLIGHT", "S4"), even though `LeakageV2Controls.severities`/`.lifecycleClasses`/
 * `.modes[].value` are lowercase (what you send back as a query param). The handoff doc's own
 * type declares `severity` as lowercase ("s1".."s5") — live data contradicts the doc there
 * specifically. Compare these fields against the option lists case-insensitively; never assume
 * an exact string match. Left as plain `string` rather than a literal union because of that
 * mismatch.
 */
export interface LeakageV2Amount {
  value: number;
  gross: number;
  expected: number;
  net: number;
  currency: string;
  market: string | null;
  mode: string;
  horizonDays: number;
  lifecycleClass: string;
  range: LeakageV2Range;
  confidence: number;
  confidenceLevel: string;
  severity: string;
  candidateCount: number;
  asOfUtc: string;
  calculationReference: string;
}

export interface LeakageV2Subject {
  type: string;
  grain: string;
  unit: string;
}

export interface LeakageV2Coordinate {
  mechanism: string;
  mechanismLabel: string;
  revenueStage: string;
  revenueStageLabel: string;
  stateDimension: string;
  stateDimensionLabel: string;
  stateValue: string;
  stateValueLabel: string;
  subject: LeakageV2Subject;
  businessUnitScope: string | null;
}

export interface LeakageV2CellState {
  display: LeakageV2DisplayState;
  sourceAvailability: LeakageV2Availability;
  facets: LeakageV2DisplayFacet[];
  hiddenBy: string[];
}

export interface LeakageV2Cell {
  id: string;
  sector: string;
  sectorLabel: string;
  coordinate: LeakageV2Coordinate;
  state: LeakageV2CellState;
  amounts: LeakageV2Amount[];
  signalIds: string[];
  limitations: string[];
}

export interface LeakageV2Rollup {
  dimension: "mechanism" | "stage" | "state" | "market" | "currency" | "severity" | "sector" | "total";
  value: string;
  currency: string;
  market: string | null;
  lifecycleClass: string;
  amount: number;
  mode: string;
  cellCount: number;
}

export interface LeakageV2CoverageSummary {
  effective: number | null;
  capability: number | null;
  scope: number | null;
  freshness: number | null;
  quality: number | null;
  applicableSignals: number;
  measuredSignals: number;
  declaredOnlySignals: number;
  residualUnknownUnits: number;
}

// ===== Added 2026-10-04 (Phase 1-4 handoff) — page-level summary, readiness and limitation blocks.

export type LeakageV2MeasurementState = "MEASURED" | "PARTIALLY_MEASURED" | "UNAVAILABLE";

/**
 * One exact currency + optional attributed market + lifecycle class.
 * Confirmed live 2026-10-04: unattributed exposure comes back as the literal string `"UNASSIGNED"`,
 * not `null` (the handoff prose still says null). Treat both as "Unassigned market".
 */
export interface LeakageV2ActionableExposure {
  currency: string;
  market: string | null;
  lifecycleClass: string;
  value: number;
  gross: number;
  expected: number;
  net: number;
  mode: string;
  cellCount: number;
}

export interface LeakageV2MaterialLeakItem {
  /** Meaningful only inside its own material-leak group. */
  rankWithinScope: number;
  cellId: string;
  mechanism: string;
  mechanismLabel: string;
  revenueStage: string;
  revenueStageLabel: string;
  amount: LeakageV2Amount;
}

export interface LeakageV2MaterialLeakGroup {
  currency: string;
  market: string | null;
  lifecycleClass: string;
  items: LeakageV2MaterialLeakItem[];
}

/** Separately named counts — never add candidate, observation and cell counts together. */
export interface LeakageV2MeasurementCounts {
  pricedCandidateCount: number;
  unpricedCandidateCount: number;
  unpriceableObservationCount: number;
  populatedCellCount: number;
  measuredZeroCellCount: number;
  unavailableCellCount: number;
}

export interface LeakageV2Summary {
  measurementState: LeakageV2MeasurementState;
  actionableExposure: LeakageV2ActionableExposure[];
  materialLeaks: LeakageV2MaterialLeakGroup[];
  measurement: LeakageV2MeasurementCounts;
}

export type LeakageV2ReadinessState = "READY" | "ACTION_REQUIRED" | "WAITING_FOR_DATA" | "UNAVAILABLE";

export type LeakageV2ReadinessCategory =
  | "SECTOR_CONFIRMATION"
  | "SOURCE_CAPABILITY"
  | "HISTORY"
  | "PRICING"
  | "POLICY_CONFIGURATION"
  | "PLATFORM_CAPABILITY";

export type LeakageV2LimitationOrigin =
  | "WORKSPACE_DATA"
  | "WORKSPACE_HISTORY"
  | "WORKSPACE_CONFIGURATION"
  | "SECTOR_POLICY"
  | "PLATFORM_CAPABILITY"
  | "OTHER";

/** `sources.connect` / `sources.review_capability` run against the datasources surface; enable only when `eligible`. */
export interface LeakageV2ReadinessAction {
  kind: string;
  label: string;
  eligible: boolean;
  target: "datasources" | null;
  capabilityId: string | null;
  sourceId: string | null;
  missingRequirements: string[];
  unavailableReason: string | null;
}

export interface LeakageV2ReadinessItem {
  category: LeakageV2ReadinessCategory;
  state: LeakageV2ReadinessState;
  origin: Exclude<LeakageV2LimitationOrigin, "OTHER">;
  message: string;
  affectedCount: number;
  currencies: string[];
  action: LeakageV2ReadinessAction | null;
}

export interface LeakageV2Readiness {
  state: "READY" | "ACTION_REQUIRED" | "LIMITED";
  actionRequiredCount: number;
  waitingCount: number;
  unavailableCount: number;
  items: LeakageV2ReadinessItem[];
}

export type LeakageV2LimitationCode =
  | "CAPABILITY_GAP"
  | "SECTOR_ASSIGNMENT_MISSING"
  | "PRICING_INPUT_MISSING"
  | "BASELINE_HISTORY_MISSING"
  | "CURRENCY_POLICY_MISSING"
  | "NORMALIZED_FACTS_UNAVAILABLE"
  | "OTHER";

export interface LeakageV2LimitationSummaryItem {
  code: LeakageV2LimitationCode;
  origin: LeakageV2LimitationOrigin;
  message: string;
  affectedCount: number;
  recommendedAction: string;
  currencies: string[];
}

export interface LeakageV2LimitationSummary {
  /** Total diagnostics behind this bounded summary; page through them via `/leakage/limitations`. */
  detailCount: number;
  items: LeakageV2LimitationSummaryItem[];
  detailsPath: "/api/v3/leakage/limitations";
}

/**
 * Confirmed live 2026-10-01 to be very large on a thin test workspace (150+ entries, one per
 * unpriced candidate, e.g. "Candidate '...' remains unpriced because sector '...' has no severity
 * thresholds in GBP; no FX conversion was inferred.") — never render this as a flat bullet list.
 * See Step 2 in docs/leakage-map/v2-build-plan.md.
 */
export interface LeakagePageV2 {
  contractVersion: "2.0";
  controls: LeakageV2Controls;
  publication: LeakageV2Publication;
  /** Added 2026-10-04: headline money cards (actionableExposure) + material-leak cards. */
  summary: LeakageV2Summary;
  /** Added 2026-10-04: compact status strip beside the summary. */
  readiness: LeakageV2Readiness;
  cells: LeakageV2Cell[];
  rollups: LeakageV2Rollup[];
  coverage: LeakageV2CoverageSummary;
  /** Added 2026-10-04: replaces `limitations` for display. Never render both. */
  limitationSummary: LeakageV2LimitationSummary;
  /** Added 2026-10-04 (Executive Phase 2). Old saved payloads omit it — keep the page working without. */
  executive?: LeakageExecutive;
  /** Added 2026-10-04 (Phase 4). */
  coverageExplanation?: LeakageCoverageExplanation;
  /** Compatibility field only — same bounded category messages as `limitationSummary`, never every diagnostic. */
  limitations: string[];
}

export type LeakagePageResponseData = LeakagePageData | LeakagePageV2;

/** Narrows a `GetLeakageResponse.data` to V2 — check this before reading any V2-only field. */
export const isLeakagePageV2 = (
  data: LeakagePageResponseData
): data is LeakagePageV2 => (data as LeakagePageV2).contractVersion === "2.0";

export interface GetLeakageResponse {
  data: LeakagePageResponseData;
  messages: string[];
  succeeded: boolean;
}

/**
 * V2's query params, per the handoff doc — a different shape from `GetLeakageParams` above (no
 * `window`, `mode` instead of `calculate`, plain `severity`/`confidence` instead of
 * `minSeverity`/`minConfidence`, plus `sector`/`lifecycleClass` which V1 doesn't have at all).
 * `getLeakage` accepts either shape on the same endpoint — which one a given request should use
 * isn't known until a response reveals `contractVersion`, so the page sends `GetLeakageParams` by
 * default and switches to this shape only once it has confirmed it's talking to a V2 workspace.
 */
export interface GetLeakageV2Params {
  mode?: string;
  horizon?: string;
  horizonDays?: number;
  /** Explicit market attribution. `UNASSIGNED` filters unattributed exposure. */
  market?: string;
  /** Denomination, sent as its own param even when `market` is also set (e.g. `market=NG&currency=NGN`). */
  currency?: string;
  sector?: string;
  severity?: string;
  confidence?: string;
  lifecycleClass?: string;
}

const {
  LEAKAGE: { GET_LEAKAGE },
} = API_ENDPOINTS;

export const getLeakage = async (
  params?: GetLeakageParams | GetLeakageV2Params
): Promise<GetLeakageResponse> => {
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
