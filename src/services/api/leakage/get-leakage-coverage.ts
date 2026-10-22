import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Availability, LeakageV2CoverageSummary, LeakageV2Subject } from "@/services/api/leakage/get-leakage";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// The main page response already embeds a `coverage: LeakageV2CoverageSummary` — this standalone
// route gives the full per-signal/per-subject breakdown behind that summary number.
// ⚠️ The handoff doc's query-params sentence ("The main and cell routes accept mode=...") doesn't
// explicitly list this route — called with no params for now; confirm live whether it needs any.

export interface LeakageCoverageSignalEntry {
  signalId: string;
  subject: LeakageV2Subject;
  maturity: string;
  sourceAvailability: LeakageV2Availability;
  runOutcome: string;
  weight: number;
  capability: number;
  scope: number;
  freshness: number;
  quality: number;
  eligibleUnits: number;
  usableUnits: number;
  residualUnknownUnits: number;
  missingJoinUnits: number;
  missingValueUnits: number;
}

export interface LeakageCoverageSubjectComponent {
  name: string;
  signalId: string;
  maturity: string;
  runOutcome: string;
  numerator: number;
  denominator: number;
  ratio: number;
}

export interface LeakageCoverageSubjectEntry {
  subject: LeakageV2Subject;
  signalPopulationPairs: number;
  measurableSignalPopulationPairs: number;
  components: LeakageCoverageSubjectComponent[];
}

export interface CoverageV2 {
  contractVersion: "2.0";
  summary: LeakageV2CoverageSummary;
  signals: LeakageCoverageSignalEntry[];
  subjects: LeakageCoverageSubjectEntry[];
  asOfUtc: string;
  policyVersion: string;
}

export interface GetLeakageCoverageResponse {
  data: CoverageV2;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_COVERAGE },
} = API_ENDPOINTS;

export const getLeakageCoverage = async (): Promise<GetLeakageCoverageResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageCoverageResponse>(GET_LEAKAGE_COVERAGE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch coverage detail");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
