import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Amount, LeakageV2CellState } from "@/services/api/leakage/get-leakage";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: "History contains published snapshots only and is newest first. An empty `points` array is
// a valid 'no earlier publication' state. Historical records can have unavailable confidence/range
// detail when the compact projection did not persist it — do not infer it from the current cell."

export interface LeakageV2HistoryPoint {
  snapshotId: string;
  runId: string;
  asOfUtc: string;
  publishedAtUtc: string;
  state: LeakageV2CellState;
  amounts: LeakageV2Amount[];
}

export interface CellHistoryV2 {
  contractVersion: "2.0";
  cellId: string;
  limit: number;
  points: LeakageV2HistoryPoint[];
}

export interface GetLeakageCellHistoryParams {
  cellId: string;
  /** 1-100, default per the endpoint's own default (doc example uses 30). */
  limit?: number;
  mode?: string;
  lifecycleClass?: string;
}

export interface GetLeakageCellHistoryResponse {
  data: CellHistoryV2;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CELL_HISTORY },
} = API_ENDPOINTS;

export const getLeakageCellHistory = async ({
  cellId,
  limit,
  mode,
  lifecycleClass,
}: GetLeakageCellHistoryParams): Promise<GetLeakageCellHistoryResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageCellHistoryResponse>(
      GET_LEAKAGE_CELL_HISTORY.replace("{cellId}", cellId),
      { params: { limit, mode, lifecycleClass } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch this cell's history");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
