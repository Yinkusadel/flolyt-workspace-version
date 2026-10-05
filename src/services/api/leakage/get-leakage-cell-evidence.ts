import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageV2Cell, LeakageV2Publication } from "@/services/api/leakage/get-leakage";
import type { LeakageV2CellComponent, LeakageV2CellSignal, LeakageV2WorkState } from "@/services/api/leakage/get-leakage-cell-v2";
import type { LeakageCoverageSignalEntry } from "@/services/api/leakage/get-leakage-coverage";
import type { LeakageCalculationPolicyRow } from "@/services/api/leakage/get-leakage-calculation";

// Scaffolded 2026-10-01 from doc prose, corrected 2026-10-02 against the real Scalar schema the
// user pasted — every field below is now confirmed shape, not reconstructed guesswork. Still not
// wired into a page, and the real response body itself hasn't been pulled live yet (schema ≠ a
// real instance) — see docs/leakage-map/v2-build-plan.md.

export interface LeakageEvidenceSelection {
  mode: string;
  horizon: string;
  horizonDays: number;
  lifecycleClass: string | null;
}

export interface LeakageEvidenceLineageCandidate {
  sourceId: string;
  sourceName: string;
  state: string;
  observedAtUtc: string | null;
  mappingVersion: string | null;
  quality: number | null;
  populationCoverage: number | null;
  lineageReferences: string[];
}

export interface LeakageEvidenceLineageAction {
  kind: string;
  label: string;
  sourceId: string | null;
  missingRequirements: string[];
}

/** The doc called this "extended capability lineage and candidates" without saying what was
 * extended — confirmed against the real schema: `explanation`, `missingRequirements`, and
 * `candidates[]` on top of the base lineage fields `CellDetailV2.lineage[]` already has. */
export interface LeakageEvidenceLineage {
  signalId: string;
  capabilityResolutionId: string;
  capabilityId: string;
  sourceAvailability: string;
  selectedSourceIds: string[];
  evaluatedAtUtc: string;
  resolverVersion: string;
  actions: LeakageEvidenceLineageAction[];
  explanation: string;
  missingRequirements: string[];
  candidates: LeakageEvidenceLineageCandidate[];
}

export interface LeakageEvidenceActionTarget {
  resource: string;
  resourceId: string | null;
}

export interface LeakageEvidenceActionEligibility {
  eligible: boolean;
  reason: string | null;
  requiredCapabilities: string[];
}

/**
 * The permitted-action entries — the doc's "permitted actions" turned out to be named
 * `suggestedActions` in the real response, not `actions` (corrected 2026-10-02). `kind`'s only
 * seen value so far is Scalar's own generic example ("OpenRecord") rather than the doc's own named
 * identities (`revenue_leaks.review`, `revenue_leaks.open_room`, `rooms.view`,
 * `sources.review_capability`, `sources.connect`) — left as a plain `string`, not a literal union,
 * until a real response shows which vocabulary actually comes back.
 */
export interface LeakageEvidenceSuggestedAction {
  id: string;
  kind: string;
  label: string;
  target: LeakageEvidenceActionTarget;
  parameters: Record<string, unknown> | null;
  eligibility: LeakageEvidenceActionEligibility;
}

export interface LeakageEvidenceV2 {
  contractVersion: "flolyt.revenue-leakage-evidence.v1";
  evidenceId: string;
  question: string;
  selection: LeakageEvidenceSelection;
  cell: LeakageV2Cell;
  components: LeakageV2CellComponent[];
  signals: LeakageV2CellSignal[];
  lineage: LeakageEvidenceLineage[];
  /** Confirmed 2026-10-02: an array of per-signal entries, the same shape as the standalone
   * `GET /leakage/coverage` route's own `signals[]` — not the page-level `LeakageV2CoverageSummary`. */
  coverage: LeakageCoverageSignalEntry[];
  /** Confirmed 2026-10-02: two separate top-level fields, not one nested `calculation` object as
   * first scaffolded — `calculationPolicies` reuses `GET /leakage/calculation`'s own row shape. */
  calculationPolicies: LeakageCalculationPolicyRow[];
  calculationFormulas: string[];
  limitations: string[];
  workState: LeakageV2WorkState;
  suggestedActions: LeakageEvidenceSuggestedAction[];
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
