import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface WinBackWaveDto {
  campaignId: string;
  name: string;
  state: string;
  startedAtUtc: string | null;
  audience: number;
  holdout: number;
  targetedPastBoundary: number;
  treatmentRecoveryShare: number | null;
  holdoutRecoveryShare: number | null;
  /** Only available when attribution === "holdout". */
  liftPoints: number | null;
  attribution: string;
  unattributableBecause: string | null;
}

export interface ChurnWinBackData {
  stageKey: string;
  stageName: string;
  basis: string;
  basisCaveat: string;
  lapsedCustomers: number;
  /** Lapsed nobody has tried. */
  reachableNeverContacted: number;
  /** Lapsed nobody can try. */
  unreachable: number;
  waves: WinBackWaveDto[];
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetChurnWinBackResponse {
  data: ChurnWinBackData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_CHURN_WIN_BACK },
} = API_ENDPOINTS;

export const getChurnWinBack = async (): Promise<GetChurnWinBackResponse> => {
  try {
    const response = await axiosInstance.get<GetChurnWinBackResponse>(GET_CHURN_WIN_BACK);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Churn's win-back waves");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
