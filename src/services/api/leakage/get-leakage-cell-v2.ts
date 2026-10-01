import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Amount, LeakageV2Availability, LeakageV2Cell, LeakageV2Publication } from "@/services/api/leakage/get-leakage";

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

export interface LeakageV2WorkState {
  state: "UNREADY" | "READY";
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
