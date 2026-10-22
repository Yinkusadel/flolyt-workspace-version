import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Publication } from "@/services/api/leakage/get-leakage";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// "An explanation surface" per the doc — display the calculation version, formulas, correlation/
// range policies, and exact baseline/ramp/recovery/severity policy rows; treat assumptions and
// limitations as first-class content.
// ⚠️ No query params documented for this route either — called with none for now, same caveat as
// get-leakage-coverage.ts.

export interface LeakageCalculationPolicyRow {
  sector: string;
  sectorVersion: string;
  mechanism: string;
  baselineId: string;
  probability: number;
  baselineBasis: string;
  rampId: string;
  rampVersion: string;
  rampFactors: Record<string, number>;
  recoveryId: string;
  recoveryVersion: string;
  recoveryRate: number;
  recoveryBasis: string;
  severityPolicyId: string;
  severityPolicyVersion: string;
  severityCurrency: string;
}

export interface CalculationV2 {
  contractVersion: "2.0";
  calculationVersion: string;
  correlationPolicy: string;
  rangePolicy: string;
  modes: string[];
  horizonDays: number[];
  formulas: string[];
  policies: LeakageCalculationPolicyRow[];
  assumptions: string[];
  limitations: string[];
  publication: LeakageV2Publication;
}

export interface GetLeakageCalculationResponse {
  data: CalculationV2;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CALCULATION },
} = API_ENDPOINTS;

export const getLeakageCalculation = async (): Promise<GetLeakageCalculationResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageCalculationResponse>(GET_LEAKAGE_CALCULATION);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the calculation explanation");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
