import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Amount, LeakageV2Availability, LeakageV2Cell, LeakageV2Publication } from "@/services/api/leakage/get-leakage";
import type { LeakageMarketAttribution } from "@/services/api/leakage/leakage-executive-types";
import type { RevenueLeakCaseStatus } from "@/services/api/leakage/leakage-case-types";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
// `_V2` naming/`{cellId}` path distinguishes this from V1's 4-segment-path `getLeakageCell`.

export interface LeakageV2CellComponent {
  candidateId: string;
  signalId: string;
  mechanism: string;
  revenueStage: string;
  lifecycleClass: string;
  amount: LeakageV2Amount;
}

export interface LeakageV2CellSignal {
  id: string;
  signalId: string;
  observationFromUtc: string;
  observationToUtc: string;
  signalValue: number;
  confidence: number;
  currency: string | null;
  market: string | null;
  lifecycleClass: string;
  lineageReferences: string[];
  detectorVersion: string;
  baselineReference: string;
  /**
   * Added 2026-10-04: the doc says cell-detail observations expose the same `attribution` object as
   * `executive.markets[]`, but its own TS block for this signal omits it, so it stays optional until a
   * live cell-detail response confirms it. Observations from before the Phase 1 recompute may lack it.
   */
  attribution?: LeakageMarketAttribution;
}

export interface LeakageV2LineageAction {
  kind: string;
  label: string;
  sourceId: string | null;
  missingRequirements: string[];
}

export interface LeakageV2Lineage {
  signalId: string;
  capabilityResolutionId: string;
  capabilityId: string;
  sourceAvailability: LeakageV2Availability;
  selectedSourceIds: string[];
  evaluatedAtUtc: string;
  resolverVersion: string;
  actions: LeakageV2LineageAction[];
}

/**
 * Doc: "`workState.state` is `UNREADY` when case rollout is disabled, `READY` when the finding can
 * create a case, and **the current case status after creation**" — so once `revenueLeakCaseId` is
 * set, `state` becomes one of `RevenueLeakCaseStatus` (e.g. `"DETECTED"`, `"ASSIGNED"`), not just
 * the two gate values. Narrowed to `"UNREADY" | "READY"` originally (2026-10-01), widened
 * 2026-10-02 on a careful re-read before building case UI on top of it.
 */
export interface LeakageV2WorkState {
  state: "UNREADY" | "READY" | RevenueLeakCaseStatus;
  revenueLeakCaseId: string | null;
  roomId: string | null;
  explanation: string;
}

export interface CellDetailV2 {
  contractVersion: "2.0";
  cell: LeakageV2Cell;
  components: LeakageV2CellComponent[];
  signals: LeakageV2CellSignal[];
  lineage: LeakageV2Lineage[];
  workState: LeakageV2WorkState;
  publication: LeakageV2Publication;
}

export interface GetLeakageCellV2Params {
  cellId: string;
  mode?: string;
  horizon?: string;
  horizonDays?: number;
  lifecycleClass?: string;
}

export interface GetLeakageCellV2Response {
  data: CellDetailV2;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CELL_V2 },
} = API_ENDPOINTS;

export const getLeakageCellV2 = async ({
  cellId,
  mode,
  horizon,
  horizonDays,
  lifecycleClass,
}: GetLeakageCellV2Params): Promise<GetLeakageCellV2Response> => {
  try {
    const response = await axiosInstance.get<GetLeakageCellV2Response>(
      GET_LEAKAGE_CELL_V2.replace("{cellId}", cellId),
      { params: { mode, horizon, horizonDays, lifecycleClass } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch this cell");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
