import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface LeakageMapConditionDto {
  key: string;
  label: string;
}

export interface LeakageMapCellDto {
  rowKey: string;
  rowLabel: string;
  conditionKey: string;
  conditionLabel: string;
  currency: string;
  /** A cell either carries a figure (amount + method) or names what's missing (missingSource + wouldUnlock) — never an estimate, never a zero standing in for unknown. */
  amount: number | null;
  customerCount: number | null;
  missingSource: string | null;
  wouldUnlock: string | null;
  method: string | null;
}

export interface LeakageMapGridDto {
  grid: string;
  markets: string[];
  conditions: LeakageMapConditionDto[];
  // The real response has more per-cell properties than the doc lists (confirmed truncated in
  // the spec's own example) — don't treat LeakageMapCellDto as exhaustive.
  cells: LeakageMapCellDto[];
}

export interface LeakageMapData {
  revenueModel: string | null;
  grids: LeakageMapGridDto[];
  computedAtUtc: string | null;
}

export interface GetLeakageMapResponse {
  data: LeakageMapData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_LEAKAGE_MAP },
} = API_ENDPOINTS;

export const getLeakageMap = async (): Promise<GetLeakageMapResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageMapResponse>(GET_LEAKAGE_MAP);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the leakage map");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
