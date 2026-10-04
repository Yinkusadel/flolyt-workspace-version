import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Amount } from "@/services/api/leakage/get-leakage";

// Added 2026-10-04 from the Phase 1-4 handoff (Phase 3: exact calculation drawer). Not wired yet.
// `calculationReference` is an OPAQUE value taken from a displayed amount (`amounts[].calculationReference`,
// history points, candidate components): never parse it. It identifies publication, cell, market,
// currency, lifecycle, mode and horizon, so an old reference never redirects to the newest
// publication, and a legacy pre-Phase-3 reference string does not resolve (re-read the page/history
// to get a fresh one). No company id: auth decides the workspace. Invalid/foreign/unpublished
// references, missing policy versions, incomplete evidence or totals that can't reconcile return a
// FAILED result. Show "unavailable", never substitute another calculation.
//
// ⚠️ The handoff gives NO TypeScript block for this response, only a bullet list of field names.
// Every named field is typed (all optional, since none is confirmed live); component sub-fields the
// doc only describes in prose (impact/probability/ramp/recovery/methodology/baseline/lineage/versions)
// fall under the `[key: string]: unknown` escape hatch until a live response is pasted.

export interface LeakageCalculationDetailComponent {
  /** Whether this candidate counts toward the selected total. Excluded correlated candidates contribute 0. */
  included?: boolean;
  inclusionReason?: string;
  contribution?: number;
  deduplicationKey?: string;
  gross?: number;
  expected?: number;
  net?: number;
  selectedAmount?: number;
  confidence?: number;
  assumptions?: string[];
  caveats?: string[];
  [key: string]: unknown;
}

export interface LeakageCalculationDetail {
  /** The referenced displayed amount and its selected scope. */
  amount: LeakageV2Amount;
  components: LeakageCalculationDetailComponent[];
  correlationPolicy?: string;
  /** `INFERRED_FROM_LEGACY_TOTALS` on publications that predate persisted combination mode. */
  correlationModeBasis?: string;
  /** Sums of the included components only. */
  includedGross?: number;
  includedExpected?: number;
  includedNet?: number;
  includedSelectedAmount?: number;
  /** All four totals are checked within `reconciliationTolerance` (0.0001 currency units). */
  reconciliationState?: string;
  selectedAmountDelta?: number;
  reconciliationTolerance?: number;
  [key: string]: unknown;
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
