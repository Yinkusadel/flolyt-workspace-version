import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Amount, LeakageV2Range } from "@/services/api/leakage/get-leakage";

// Added 2026-10-04 from the Phase 1-4 handoff (Phase 3: exact calculation drawer).
// `calculationReference` is an OPAQUE value taken from a displayed amount (`amounts[].calculationReference`,
// history points, candidate components): never parse it. It identifies publication, cell, market,
// currency, lifecycle, mode and horizon, so an old reference never redirects to the newest
// publication, and a legacy pre-Phase-3 reference string does not resolve (re-read the page/history
// to get a fresh one). No company id: auth decides the workspace. Invalid/foreign/unpublished
// references, missing policy versions, incomplete evidence or totals that can't reconcile return a
// FAILED result. Show "unavailable", never substitute another calculation.
//
// Shapes below are CONFIRMED LIVE 2026-10-04 (the handoff gave only a bullet list): a real NGN amount for
// the Dormant Accounts cell returned 28 components, all `included: true` / `PUBLISHED_PRIMARY`, reconciled
// with a delta of 0. Not yet seen live: an excluded component (its `inclusionReason` value is unknown, so it
// is typed as a plain string), a failed result, and a history-amount or candidate-level reference.

/** One candidate's arithmetic: gross = impact x ramp, expected = gross x probability, net = expected x (1 - recovery). */
export interface LeakageCalculationComponent {
  candidateId: string;
  observationId: string;
  mechanism: string;
  subjectReference: string;
  clusterId: string;
  correlationPolicyId: string;
  correlationPolicyVersion: string;
  /** `INFERRED_FROM_LEGACY_TOTALS` on publications that predate persisted combination mode. */
  correlationModeBasis: string;
  /** Excluded correlated candidates contribute 0 even when their own estimate is positive. */
  included: boolean;
  /** `PUBLISHED_PRIMARY` seen live for included ones; the value for an excluded one has not been seen. */
  inclusionReason: string;
  deduplicationKey: string;
  impact: number;
  probability: number;
  rampFactor: number;
  recoveryRate: number;
  gross: number;
  expected: number;
  net: number;
  selectedAmount: number;
  contribution: number;
  /** Confidence belongs to the component; no aggregate is invented. */
  confidence: number;
  range: LeakageV2Range;
  baselineReference: string;
  assumptions: string[];
  caveats: string[];
  sourceLineage: string[];
  calculationVersion: string;
  rampVersion: string;
  recoveryVersion: string;
  detectorVersion: string;
  mappingVersion: string;
  capabilityResolutionId: string;
}

export interface LeakageCalculationDetail {
  contractVersion: "2.0";
  calculationReference: string;
  publicationId: string;
  runId: string;
  asOfUtc: string;
  cellId: string;
  /** The referenced displayed amount and its selected scope. */
  amount: LeakageV2Amount;
  components: LeakageCalculationComponent[];
  /** Sums of the included components only. */
  includedGross: number;
  includedExpected: number;
  includedNet: number;
  includedSelectedAmount: number;
  /** `RECONCILED` seen live; all four totals are checked within `reconciliationTolerance`. */
  reconciliationState: string;
  selectedAmountDelta: number;
  reconciliationTolerance: number;
  /** The server's own statement of the arithmetic. */
  formula: string;
  aggregationNote: string;
}

export interface GetLeakageCalculationDetailParams {
  calculationReference: string;
}

export interface GetLeakageCalculationDetailResponse {
  data: LeakageCalculationDetail;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CALCULATION_DETAIL },
} = API_ENDPOINTS;

export const getLeakageCalculationDetail = async ({
  calculationReference,
}: GetLeakageCalculationDetailParams): Promise<GetLeakageCalculationDetailResponse> => {
  try {
    // axios URL-encodes `params` values itself, so the reference is passed raw here.
    const response = await axiosInstance.get<GetLeakageCalculationDetailResponse>(
      GET_LEAKAGE_CALCULATION_DETAIL,
      { params: { calculationReference } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch this calculation");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
