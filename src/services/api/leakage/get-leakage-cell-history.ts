import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Amount, LeakageV2CellState } from "@/services/api/leakage/get-leakage";

// Scaffolded 2026-10-02 — the last of the handoff doc's 4 scaffolded-but-unbuilt V2 routes to get a
// real UI (`cells/{cellId}/history`), the other 3 either redundant with data `GET /leakage` already
// carries inline (coverage/calculation) or intentionally skipped as ops-only
// (cutover-readiness) — see docs/leakage-map/v2-build-plan.md's "Current endpoint status".

export interface LeakageV2HistoryPoint {
  snapshotId: string;
  runId: string;
  asOfUtc: string;
  publishedAtUtc: string;
  state: LeakageV2CellState;
  amounts: LeakageV2Amount[];
}

export interface LeakageV2CellHistory {
  contractVersion: "2.0";
  cellId: string;
  limit: number;
  points: LeakageV2HistoryPoint[];
}

export interface GetLeakageCellHistoryParams {
  cellId: string;
  mode?: string;
  lifecycleClass?: string;
  /** Doc: "limit 1–100", defaults to 30 server-side if omitted. */
  limit?: number;
}

export interface GetLeakageCellHistoryResponse {
  data: LeakageV2CellHistory;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CELL_HISTORY },
} = API_ENDPOINTS;

export const getLeakageCellHistory = async ({
  cellId,
  mode,
  lifecycleClass,
  limit,
}: GetLeakageCellHistoryParams): Promise<GetLeakageCellHistoryResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageCellHistoryResponse>(
      GET_LEAKAGE_CELL_HISTORY.replace("{cellId}", cellId),
      { params: { mode, lifecycleClass, limit } }
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
