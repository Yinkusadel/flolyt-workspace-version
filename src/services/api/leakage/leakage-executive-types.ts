import type {
  LeakageV2Amount,
  LeakageV2Coordinate,
  LeakageV2CoverageSummary,
  LeakageV2ReadinessAction,
} from "@/services/api/leakage/get-leakage";

// Added 2026-10-04 from the Phase 1-4 handoff (docs/leakage-map/leakage-map-v2-frontend-handoff.md).
// Shared by `GET /leakage` only, same pattern as leakage-case-types.ts.
//
// Shapes below are CONFIRMED LIVE 2026-10-04 against a real V2 payload (the handoff gives
// only a field table and prose for it, no TS block, and several of its names differ from what the
// table implies: e.g. the per-bucket money fields are `grossExposure`/`expectedLoss`/`netExpectedLoss`,
// not gross/expected/net, and there is no top-level `selectedAmount`).
//
// `coverageExplanation` and the tail of `executive` (publicationCoverage, coverageMessage, full matrix)
// were confirmed from the same live payload in a second paste. Nothing in this file is a guess any more,
// but only ONE workspace shape has been seen: a thin one where every amount sits in the UNASSIGNED market,
// so KE/NG market rows are all empty. Re-check once a workspace with market-attributed data exists.

/** Scope and state of one market row; `code: "UNASSIGNED"` is the unattributed bucket. */
export interface LeakageMarketAttribution {
  code: string;
  /** `ASSIGNED` | `UNASSIGNED` seen live. */
  state: string;
  /** `PUBLISHED_ATTRIBUTION` | `NO_SUPPORTED_ATTRIBUTION` seen live. */
  basis: string;
}

export type LeakageExecutiveBreakdown = "market" | "mechanism";

export interface LeakageExecutiveMarketInventory {
  /** Always `PUBLICATION`: filters never rewrite workspace configuration. */
  scope: string;
  configuredMarkets: string[];
  /** Markets with published observations; a lower bound, `[]` on a workspace with only Unassigned data. */
  measurableMarkets: string[];
  marketsWithExposure: string[];
  /** `PUBLISHED_OBSERVATIONS_LOWER_BOUND`. */
  measurabilityBasis: string;
  /** Positive monetary exposure exists with no supported market attribution. */
  hasUnassignedExposure: boolean;
  configuredMarketCount: number;
  measurableMarketCount: number;
  marketsWithExposureCount: number;
}

/**
 * One bucket per currency + lifecycle class, filtered to the current selection. Money is split by
 * currency and never to be summed across them (no FX). `selectedAmount` is whichever of the three
 * the selected mode names.
 */
export interface LeakageExecutiveAmount {
  currency: string;
  lifecycleClass: string;
  grossExposure: number;
  expectedLoss: number;
  netExpectedLoss: number;
  selectedAmount: number;
}

/** Counts of distinct subjects within one market and subject/grain. Keep units separate, never sum across markets. */
export interface LeakageExecutiveAffectedEntities {
  subjectType: string;
  grain: string;
  unit: string;
  /** Null when `state` is `UNAVAILABLE`: unknown, never zero. A distinct-entity union, not a sum of mechanism counts. */
  count: number | null;
  /** `EXACT` accompanies a number, `UNAVAILABLE` a null. Added 2026-10-05. */
  state: "EXACT" | "UNAVAILABLE" | (string & {});
  /** `DISTINCT_SUBJECT_REFERENCE_WITHIN_SUBJECT_TYPE_AND_GRAIN` seen live. */
  basis: string;
}

/** Largest mechanism inside one market + currency + lifecycle scope. Never a cross-currency ranking. */
export interface LeakageExecutiveFinding {
  market: string;
  currency: string;
  lifecycleClass: string;
  mechanism: string;
  label: string;
  selectedAmount: number;
  mode: string;
  /** Conservative: the lowest contributing estimate confidence. */
  confidence: number;
  confidenceLevel: string;
  cellIds: string[];
  /** Server-written sentence ("estimated gross exposure ..."). Render as given. */
  message: string;
  /** True when equal scope leaders share the top spot. Added 2026-10-05; absent on older servers. */
  isTied?: boolean;
}

/**
 * A deterministic pattern across comparable scope winners, never a monetary ranking across currencies.
 * `DOMINANT_MECHANISM_ACROSS_MARKETS` is the only kind emitted so far. Confidence is conservative, not a
 * global score. May legitimately be empty (ties or conflicting winners): never fabricate one.
 * Confirmed live 2026-10-05.
 */
export interface LeakageExecutiveHeadlineFinding {
  kind: "DOMINANT_MECHANISM_ACROSS_MARKETS" | (string & {});
  mechanism: string;
  label: string;
  marketCount: number;
  markets: string[];
  confidenceLevel: string;
  /** Server-written sentence. Render as given. */
  message: string;
}

/** Configured vs observed markets for the whole publication; discovery never updates workspace settings. */
export interface LeakageExecutiveMarketReconciliation {
  configuredAndObserved: string[];
  configuredNotObserved: string[];
  observedNotConfigured: string[];
  hasUnassignedExposure: boolean;
  /** True when the observed markets differ from the configured ones and the setup should be reviewed. */
  requiresReview: boolean;
}

export interface LeakageExecutiveMarket {
  attribution: LeakageMarketAttribution;
  isConfigured: boolean;
  /** Deprecated: keeps exactly its old "an observation exists" meaning. */
  hasMeasurementEvidence: boolean;
  /** Publication evidence (added 2026-10-05, registry 1.6.0); optional so older servers still read. */
  hasObservationEvidence?: boolean;
  hasCandidateEvidence?: boolean;
  /** Positive gross exposure in the current selection; does not upgrade estimate confidence. */
  hasMeasuredExposure?: boolean;
  /** A known positive distinct count in this selection; use `affectedEntitiesState` to tell unknown from zero. */
  hasAffectedEntities?: boolean;
  /** `EXACT` | `UNAVAILABLE` (an admitted cluster member lacks identity). */
  affectedEntitiesState?: "EXACT" | "UNAVAILABLE" | (string & {});
  /** Server-written reason for an unpriced or filtered-out market. Render as given. */
  evidenceExplanation?: string;
  /** Empty for a configured market with no scoped evidence. An empty list is NOT a monetary zero. */
  amounts: LeakageExecutiveAmount[];
  affectedEntities: LeakageExecutiveAffectedEntities[];
  /** Always `null` today: there is no per-market denominator. Use the publication-wide coverage instead. */
  coverage: number | null;
  /** `MARKET_DENOMINATOR_UNAVAILABLE` today. */
  coverageState: string;
  largestMechanisms: LeakageExecutiveFinding[];
}

/** Low-confidence share of one currency + lifecycle bucket. Confidence is per finding, never per company. */
export interface LeakageExecutiveConfidence {
  currency: string;
  lifecycleClass: string;
  findingCount: number;
  lowConfidenceFindingCount: number;
  expectedLoss: number;
  lowConfidenceExpectedLoss: number;
  /** 0..1. Render as "30% of USD expected loss is associated with low-confidence findings". */
  lowConfidenceExpectedLossShare: number;
  basis: string;
}

export type LeakageExecutiveMatrixFacet = "COMPOUND" | "LOW_CONFIDENCE" | (string & {});

/**
 * One market's entry in a matrix row. `UNKNOWN` + `NO_MARKET_SCOPED_MEASUREMENT` means this market has
 * no scoped evidence (not a measured zero). `HIDDEN_BY_FILTER` entries carry no amounts. Full amounts
 * (with `calculationReference`) are the same shape as `cells[].amounts[]`.
 */
export interface LeakageExecutiveMatrixMarketEntry {
  market: string;
  /** `POPULATED` | `UNKNOWN` | `NO_EXPOSURE` | `HIDDEN_BY_FILTER`. */
  display: string;
  /** `PUBLISHED_EXPOSURE` | `NO_MARKET_SCOPED_MEASUREMENT` seen live. */
  reason: string;
  facets: LeakageExecutiveMatrixFacet[];
  amounts: LeakageV2Amount[];
}

export interface LeakageExecutiveMatrixRow {
  cellId: string;
  sector: string;
  coordinate: LeakageV2Coordinate;
  /** Overall row state; a publication-wide NO_EXPOSURE is not a per-market measured zero. */
  publicationDisplay: string;
  markets: LeakageExecutiveMatrixMarketEntry[];
}

export interface LeakageExecutive {
  /** `FILTERED_EXPOSURE; PUBLICATION_MARKET_INVENTORY_AND_COVERAGE`: exposure follows filters, inventory/coverage don't. */
  scope: string;
  /** Always `EXPECTED`. */
  recommendedMode: string;
  /** The mode actually selected (`GROSS` live). Drives each total's `selectedAmount`. */
  selectedMode: string;
  /** `market` when more than one market/bucket is relevant, otherwise `mechanism`. */
  recommendedBreakdown: LeakageExecutiveBreakdown | (string & {});
  /** True only when more than one sector occurs in the map. */
  showSectorBreakdown: boolean;
  /** `NOT_CONSOLIDATED_NO_APPROVED_FX`: reporting currency is metadata, no converted/global total. */
  fxState: string;
  reportingCurrency: string | null;
  marketInventory: LeakageExecutiveMarketInventory;
  totals: LeakageExecutiveAmount[];
  markets: LeakageExecutiveMarket[];
  /** Deprecated and empty on new responses (registry 1.6.0); use `headlineFindings` and `markets[].largestMechanisms`. */
  keyFindings: LeakageExecutiveFinding[];
  /** Page-summary headlines. Optional: absent on older servers. */
  headlineFindings?: LeakageExecutiveHeadlineFinding[];
  marketReconciliation?: LeakageExecutiveMarketReconciliation;
  confidence: LeakageExecutiveConfidence[];
  matrix: LeakageExecutiveMatrixRow[];
  /** Publication-wide, independent of current filters. Same shape as the page's top-level `coverage`. */
  publicationCoverage: LeakageV2CoverageSummary;
  /** Server-written sentence. Render as given. */
  coverageMessage: string;
}

export type LeakageCoverageIssueCategory =
  | "WORKSPACE_ACTION"
  | "WAITING_FOR_DATA"
  | "QUALITY"
  | "PERMISSION"
  | "PLATFORM_LIMITATION";

/**
 * Codes seen live: `PLATFORM_CAPABILITY`, `HISTORY`, `PRICING`, `SECTOR_CONFIRMATION`,
 * `CAPABILITY_NOT_CONFIRMED` (one per capability, with `capabilityId` + `subjectType` + `grain`).
 * Plain `string` because the doc lists no closed set. `message` is the business explanation.
 */
export interface LeakageCoverageIssue {
  code: string;
  category: LeakageCoverageIssueCategory;
  message: string;
  capabilityId: string | null;
  subjectType: string | null;
  grain: string | null;
  /** Alphabetical here; the nested `action.missingRequirements` can be in a different order. */
  missingRequirements: string[];
  /** Same shape as `readiness.items[].action`. Offer only when `eligible`, otherwise show `unavailableReason`. */
  action: LeakageV2ReadinessAction | null;
}

export interface LeakageCoverageExplanation {
  measuredSignals: number;
  applicableSignals: number;
  /** Publication-wide ratio of the detectable leakage surface, not revenue coverage. */
  effectiveCoverage: number | null;
  /** "3 of 7 applicable signals measured". Lead with this. */
  headline: string;
  explanation: string;
  /** `PUBLICATION`. */
  scope: string;
  issues: LeakageCoverageIssue[];
}
