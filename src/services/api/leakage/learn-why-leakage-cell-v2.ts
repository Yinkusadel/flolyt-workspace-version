import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// Doc: "POST /cells/{cellId}/learn-why has no request body. Put the same calculation controls in
// its query string. Its result contains conversationId, runId, agentKey, agentLabel, title,
// question, and horizonDays. Immediately open GET /api/v3/runs/{runId}/stream as an SSE stream and
// feed those events through the normal conversation reducer." Starting the SSE stream itself is a
// separate concern (see docs/frontend-agent-v3-handoff.md) — this file only covers starting the run.
// Requires the company to be selected by BOTH LeakageV2:ReadRollout and LeakageV2:AgentContextRollout.

export interface LearnWhyLeakageCellV2Result {
  conversationId: string;
  runId: string;
  agentKey: string;
  agentLabel: string;
  title: string;
  question: string;
  horizonDays: number;
}

export interface LearnWhyLeakageCellV2Params {
  cellId: string;
  mode?: string;
  horizon?: string;
  horizonDays?: number;
  lifecycleClass?: string;
}

export interface LearnWhyLeakageCellV2Response {
  data: LearnWhyLeakageCellV2Result;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { LEARN_WHY_LEAKAGE_CELL_V2 },
} = API_ENDPOINTS;

export const learnWhyLeakageCellV2 = async ({
  cellId,
  mode,
  horizon,
  horizonDays,
  lifecycleClass,
}: LearnWhyLeakageCellV2Params): Promise<LearnWhyLeakageCellV2Response> => {
  try {
    const response = await axiosInstance.post<LearnWhyLeakageCellV2Response>(
      LEARN_WHY_LEAKAGE_CELL_V2.replace("{cellId}", cellId),
      null,
      { params: { mode, horizon, horizonDays, lifecycleClass } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to ask why this cell is leaking");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
