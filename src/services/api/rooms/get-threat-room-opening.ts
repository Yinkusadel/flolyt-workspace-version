import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export type ThreatRoomOpeningState =
  | "PENDING"
  | "READY"
  | "PENDING_HUMAN_ROUTING"
  | "PENDING_LEGACY_REVIEW"
  | "BLOCKED"
  | "PAUSED";

/** Money and ratios arrive as `number | string` (int64/double with a string pattern). Display
 * formatting only; never combine them. */
export type OpeningNumeric = number | string;

export type OpeningLifecycleClass = "Realized" | "InFlight" | "Latent" | null;

export interface OpeningScope {
  companyId: string;
  sector: string;
  mechanism: string;
  subjectType: string;
  grain: string;
  stateDimension: string;
  stateValue: string;
  businessUnit: string | null;
  market: string | null;
  currency: string;
  lifecycleClass: OpeningLifecycleClass;
  issueKey?: string | null;
}

/** The scoped gross/expected/net estimate. Estimated exposure, not recovered or preserved value.
 * One currency, market and lifecycle per object; never sum across them. */
export interface OpeningExposure {
  currency: string;
  market: string | null;
  lifecycleClass: OpeningLifecycleClass;
  gross: OpeningNumeric;
  expected: OpeningNumeric;
  net: OpeningNumeric;
  candidateCount: number | string;
}

export interface OpeningStateEvidence {
  confidence: OpeningNumeric;
  oldestObservationUtc: string;
  hasSourceLineage: boolean;
}

export interface OpeningState {
  id: string;
  companyId: string;
  scope: OpeningScope;
  cellId: string;
  caseId: string | null;
  publicationId: string;
  revision: number | string;
  snapshotId: string;
  coverageId: string;
  asOfUtc: string;
  /** .NET TimeSpan string, e.g. "30.00:00:00". */
  horizon: string;
  exposure: OpeningExposure | null;
  state: string;
  signalIds: string[];
  observationIds: string[];
  blocker: string | null;
  updatedAtUtc: string;
  evidence?: OpeningStateEvidence | null;
  measuredZero?: boolean;
}

export interface OpeningEvidenceFact {
  id: string;
  signalId: string;
  value: OpeningNumeric;
  unit: string;
  confidence: OpeningNumeric;
  lineage: string[];
  observationFromUtc?: string | null;
  observationToUtc?: string | null;
  baselineReference?: string | null;
  detectorVersion?: string | null;
  capabilityResolutionId?: string;
}

export interface OpeningEvidence {
  companyId: string;
  findingId: string;
  publicationId: string;
  revision: number | string;
  snapshotId: string;
  sector: string;
  mechanism: string;
  subjectType: string;
  grain: string;
  stateDimension: string;
  stateValue: string;
  businessUnit: string | null;
  market: string;
  currency: string;
  lifecycleClass: string;
  horizonDays: number | string;
  asOfUtc: string;
  gross: OpeningNumeric;
  expected: OpeningNumeric;
  net: OpeningNumeric;
  confidence: OpeningNumeric;
  facts: OpeningEvidenceFact[];
}

export interface OpeningRange {
  lower: OpeningNumeric;
  upper: OpeningNumeric;
  basis: "Empirical" | "Calibrated" | "Assumption";
  version: string;
  probabilityMass: OpeningNumeric | null;
}

export interface OpeningEstimateContext {
  detectorId: string;
  detectorVersion: string;
  registryVersion: string;
  capabilityResolutionId: string;
  mappingVersion: string;
  observationFromUtc: string;
  observationToUtc: string;
  timeZoneId: string;
  calculationVersion: string;
  threatScorePolicyVersion: string;
}

/** One candidate's calculation. Ranges are per candidate: `rangeAvailability` of
 * PER_CANDIDATE_NOT_AGGREGATED does NOT authorize summing intervals, and null ranges mean no
 * supported range. */
export interface OpeningEstimate {
  mechanism: string;
  impact: OpeningNumeric;
  probability: OpeningNumeric;
  confidence: OpeningNumeric;
  threatScore: OpeningNumeric;
  severity: string;
  severityPolicyId: string;
  severityPolicyVersion: string;
  rampFactor: OpeningNumeric;
  rampCurveVersion: string;
  recoveryRate: OpeningNumeric;
  recoveryRateVersion: string;
  grossExposure: OpeningNumeric;
  expectedLoss: OpeningNumeric;
  netExpectedLoss: OpeningNumeric;
  grossRange: OpeningRange | null;
  expectedRange: OpeningRange | null;
  netRange: OpeningRange | null;
  currency: string;
  horizon: string;
  mode: "Gross" | "Expected" | "Net";
  baselineReference: string;
  assumptions: string[];
  caveats: string[];
  context: OpeningEstimateContext;
  asOfUtc: string;
}

export interface OpeningCalculation {
  candidateId: string;
  estimate: OpeningEstimate;
}

/** Immutable: a later refresh never changes it. */
export interface ThreatOpeningBaseline {
  id: string;
  companyId: string;
  caseId: string;
  roomId: string;
  confirmationId: string;
  openingState: OpeningState;
  evidenceHash: string;
  assessmentIds: string[];
  assessmentConfidence: OpeningNumeric;
  openedAtUtc: string;
  evidence: OpeningEvidence;
  policyFingerprint?: string | null;
  calculationBatchId?: string | null;
  calculations?: OpeningCalculation[];
  rangeAvailability?: string | null;
}

/** The opening's DRAFT next steps: proposed work, not approved or executed. Distinct from the
 * typed resolution plan (`GET /{roomId}/resolution-plan`), whose actions are objects. */
export interface ThreatOpeningPlan {
  id: string;
  companyId: string;
  roomId: string;
  ownerId: string;
  status: string;
  actions: string[];
  successCriterion: string;
}

export interface ThreatRoomOpeningData {
  /** Schema types this as a plain string; the handoff lists the six values above. */
  state: ThreatRoomOpeningState | (string & {});
  /** Why work is pending. Never show a ready collaboration Room before `READY`. */
  reason: string | null;
  roomId: string | null;
  conversationId: string | null;
  /** Attribute the automatic opening to Flolyt orchestration, not the assigned person. */
  systemActor: string | null;
  /** Audited ownership rule/fallback. Detail-level only, not the main answer. */
  routingReason: string | null;
  /** Null while the opening is pending. */
  baseline: ThreatOpeningBaseline | null;
  plan: ThreatOpeningPlan | null;
}

export interface GetThreatRoomOpeningResponse {
  data: ThreatRoomOpeningData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_THREAT_ROOM_OPENING },
} = API_ENDPOINTS;

// A pending opening is not a global inbox item. Operators get investigation IDs from the
// triage/confirmation audit; a ready Room row supplies `threatConfirmationId` itself. 404 means
// missing, foreign or restricted.
export const getThreatRoomOpening = async (
  investigationId: string
): Promise<GetThreatRoomOpeningResponse> => {
  try {
    const response = await axiosInstance.get<GetThreatRoomOpeningResponse>(
      GET_THREAT_ROOM_OPENING.replace("{investigationId}", investigationId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the threat Room opening");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
