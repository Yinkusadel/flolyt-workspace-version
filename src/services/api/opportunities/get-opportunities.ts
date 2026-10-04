import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

/**
 * A separate, positive-polarity resource from `leakage/get-leakage.ts` — per
 * docs/leakage-map/leakage-map-v2-frontend-handoff.md's Phase 7, its values must never be placed
 * in the Leakage Map grid, subtracted from leakage, or presented as missed-leakage. It's on its
 * own rollout flag (`RevenueIntelligence:OpportunityV1:ReadRollout`), independent of
 * `LeakageV2:ReadRollout` — a workspace can in principle have one enabled without the other.
 *
 * The handoff doc gives this route's response shape but, unlike `GET /leakage`, documents no query
 * parameters for it at all — so this is called with none for now. Confirm live whether it responds
 * to `mode`/`horizon`-style controls before adding any.
 */

export type OpportunityPolarity = "MISSED_OPPORTUNITY";
export type OpportunityCalibration = "ASSUMPTION" | "CALIBRATED" | "EMPIRICAL";
export type OpportunityCellState = "POPULATED" | "UNKNOWN" | "NO_OPPORTUNITY";

export interface OpportunityPublication {
  snapshotId: string;
  runId: string;
  definitionVersion: string;
  asOfUtc: string;
  builtAtUtc: string;
  publishedAtUtc: string;
}

export interface OpportunityAmount {
  currency: string;
  market?: string | null;
  grossPotential: number;
  expectedGain?: number | null;
  calibration: OpportunityCalibration;
  candidateCount: number;
}

// ===== Added 2026-10-04 (Phase 4 + canonical signals, definition version 1.2.0). Both additions are
// optional: older publications omit them until a refresh, and must still read successfully.

export type OpportunityMeasurementState =
  | "MEASURED"
  | "PARTIAL_SCOPE"
  | "PARTIAL_HISTORY"
  | "WAITING_FOR_DATA"
  | "BLOCKED"
  | "NOT_RECORDED";

/** `UNPRICED_READINESS` is the legacy cell-level value; signal-level pricing uses `UNPRICED`/`PRICED`. */
export type OpportunityValuationState = "UNPRICED_READINESS" | "NOT_ASSESSED" | "PRICED";

/**
 * ⚠️ The doc lists `label`, `measurementState`, `valuationState`, `summary`, `reasons[]`,
 * `missingRequirements`, `eligibleUnits`, `usableUnits` but gives no TS block, so `reasons[]`
 * elements and `missingRequirements`' exact type are unconfirmed. Reason action labels are guidance,
 * not executable API actions.
 */
export interface OpportunityExplanation {
  /** Render "Transaction growth readiness" for the current rule; `opportunityType` stays the stable id. */
  label: string;
  measurementState: OpportunityMeasurementState;
  valuationState: OpportunityValuationState;
  summary: string;
  reasons: Array<Record<string, unknown>>;
  missingRequirements: string[];
  eligibleUnits: number;
  usableUnits: number;
}

export type OpportunitySignalStage =
  | "DETECTED"
  | "QUALIFIED"
  | "ACTIVELY_PURSUED"
  | "CAPTURED"
  | "MISSED_WINDOW_EXPIRED"
  | "INVALIDATED";

export interface OpportunitySignalValuation {
  state: "UNPRICED" | "PRICED";
  currency: string | null;
  grossOpportunity: number | null;
  probabilityOfCapture: number | null;
  expectedGain: number | null;
  captureCost: number | null;
  captureFriction: string | null;
  netExpectedGain: number | null;
  pricingEvidence: string[];
  probabilityEvidence: string[];
  costEvidence: string[];
}

export interface OpportunitySignalOutcome {
  kind: "CAPTURED" | "MISSED_WINDOW_EXPIRED" | "INVALIDATED";
  reason: string;
  recordedAtUtc: string;
  capturedRevenue: number | null;
  currency: string | null;
  evidence: string[];
}

/**
 * Signal IDs identify publication observations, never stable workflow IDs across refreshes. Unknown
 * probability/cost/window/owner/outcome must not be rendered as zero, expired, assigned or captured.
 * `confidence` is confidence in the signal, never probability of capture.
 */
export interface OpportunitySignal {
  id: string;
  detectorId: string;
  detectorVersion: string;
  opportunityType: string;
  label: string;
  revenuePath: string;
  subjectType: string;
  grain: string;
  unit: string;
  subjectReference: string;
  market: string | null;
  stage: OpportunitySignalStage;
  pricingState: "UNPRICED" | "PRICED";
  valuation: OpportunitySignalValuation;
  confidence: number;
  availableWindow: { opensAtUtc: string | null; closesAtUtc: string | null; evidence: string[] } | null;
  evidence: string[];
  owner: { kind: string; reference: string } | null;
  outcome: OpportunitySignalOutcome | null;
  asOfUtc: string;
}

export interface OpportunityCell {
  id: string;
  polarity: OpportunityPolarity;
  opportunityType: string;
  sectorProfileId: string;
  revenueStage: string;
  subjectType: string;
  grain: string;
  unit: string;
  state: OpportunityCellState;
  candidateCount: number;
  amounts: OpportunityAmount[];
  limitations: string[];
  /** Added 2026-10-04. Omitted/`NOT_RECORDED` structured detail on older publications. */
  explanation?: OpportunityExplanation;
  /** Full count of detector signals, NOT unique businesses or money. Never sum across detectors. */
  signalCount?: number;
  /** At most 20, deterministic ID order (not a revenue ranking). Label it a preview when shorter than `signalCount`. */
  signalPreview?: OpportunitySignal[];
}

export interface RevenueOpportunityPage {
  contractVersion: "1.0";
  polarity: OpportunityPolarity;
  publication: OpportunityPublication;
  candidateCount: number;
  pricedCandidateCount: number;
  cells: OpportunityCell[];
  limitations: string[];
}

export interface GetOpportunitiesResponse {
  data: RevenueOpportunityPage;
  messages: string[];
  succeeded: boolean;
}

const {
  OPPORTUNITIES: { GET_OPPORTUNITIES },
} = API_ENDPOINTS;

export const getOpportunities = async (): Promise<GetOpportunitiesResponse> => {
  try {
    const response = await axiosInstance.get<GetOpportunitiesResponse>(GET_OPPORTUNITIES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch opportunities");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
