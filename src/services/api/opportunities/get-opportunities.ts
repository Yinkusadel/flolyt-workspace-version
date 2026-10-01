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
