import { useQuery } from "@tanstack/react-query";
import {
  getLeakageCellEvidence,
  type GetLeakageCellEvidenceParams,
  type GetLeakageCellEvidenceResponse,
} from "@/services/api/leakage/get-leakage-cell-evidence";

export const LEAKAGE_CELL_EVIDENCE_QUERY_KEY = (params: GetLeakageCellEvidenceParams) => ["leakage-cell-evidence", params];

export const useGetLeakageCellEvidence = (params: GetLeakageCellEvidenceParams, enabled = true) =>
  useQuery<GetLeakageCellEvidenceResponse, Error>({
    queryKey: LEAKAGE_CELL_EVIDENCE_QUERY_KEY(params),
    queryFn: () => getLeakageCellEvidence(params),
    enabled: enabled && !!params.cellId,
  });
