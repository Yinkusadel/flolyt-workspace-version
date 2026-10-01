import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Cell, LeakageV2Publication } from "@/services/api/leakage/get-leakage";
import type { LeakageV2CellComponent, LeakageV2CellSignal, LeakageV2Lineage, LeakageV2WorkState } from "@/services/api/leakage/get-leakage-cell-v2";

// Scaffolded 2026-10-01, not wired into a page yet — see docs/leakage-map/v2-build-plan.md.
//
// ⚠️ Unlike CellDetailV2/CellHistoryV2/CoverageV2/CalculationV2, the handoff doc gives this
// endpoint's response as PROSE ONLY, no literal TS block:
// "GET /cells/{cellId}/evidence returns contractVersion: 'flolyt.revenue-leakage-evidence.v1', a
// content-derived evidenceId, the public question, explicit selection (mode, horizon, horizonDays,
// and lifecycleClass), selected cell, components, signal observations, extended capability lineage
// and candidates, relevant coverage, calculation policies/formulas, limitations, case/Room state,
// permitted actions, and publication." Every field below is reconstructed from that sentence, not
// copied from a schema — confirm against a real response (Scalar's "Show Schema" toggle, per
// [[feedback_stop_on_truncated_endpoint_fields]]) before trusting field names/casing.

export interface LeakageEvidenceSelection {
  mode: string;
  horizon: string;
  horizonDays: number;
  lifecycleClass: string | null;
}

/** "extended capability lineage and candidates" — doc doesn't say what's extended about it
 * relative to `LeakageV2Lineage`, so this just aliases that type until a real response shows more. */
export type LeakageEvidenceLineage = LeakageV2Lineage;

export interface LeakageEvidenceV2 {
  contractVersion: "flolyt.revenue-leakage-evidence.v1";
  evidenceId: string;
  question: string;
  selection: LeakageEvidenceSelection;
  cell: LeakageV2Cell;
  components: LeakageV2CellComponent[];
  signals: LeakageV2CellSignal[];
  lineage: LeakageEvidenceLineage[];
  /** "relevant coverage" — no shape given; likely overlaps `LeakageV2CoverageSummary` but unconfirmed. */
  coverage: unknown;
  /** "calculation policies/formulas" — likely overlaps `CalculationV2` but unconfirmed. */
  calculation: unknown;
  limitations: string[];
  /** "case/Room state" — likely `LeakageV2WorkState` but doc doesn't confirm the field is named this. */
  workState: LeakageV2WorkState;
  /** "permitted actions" — server actions by typed identity (revenue_leaks.review,
   * revenue_leaks.open_room, rooms.view, sources.review_capability, sources.connect), per the
   * doc's "Render server actions by their typed identity" section. Shape of each entry unconfirmed. */
  actions: Array<Record<string, unknown>>;
  publication: LeakageV2Publication;
}

export interface GetLeakageCellEvidenceParams {
  cellId: string;
  mode?: string;
  horizon?: string;
  horizonDays?: number;
  lifecycleClass?: string;
}

export interface GetLeakageCellEvidenceResponse {
  data: LeakageEvidenceV2;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CELL_EVIDENCE },
} = API_ENDPOINTS;

export const getLeakageCellEvidence = async ({
  cellId,
  mode,
  horizon,
  horizonDays,
  lifecycleClass,
}: GetLeakageCellEvidenceParams): Promise<GetLeakageCellEvidenceResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageCellEvidenceResponse>(
      GET_LEAKAGE_CELL_EVIDENCE.replace("{cellId}", cellId),
      { params: { mode, horizon, horizonDays, lifecycleClass } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch this cell's evidence");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
