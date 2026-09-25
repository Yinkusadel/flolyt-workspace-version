import { useQuery } from "@tanstack/react-query";
import {
  getEvidence,
  type GetEvidenceParams,
  type GetEvidenceResponse,
} from "@/services/api/ai-evidence/get-evidence";

export const AI_EVIDENCE_QUERY_KEY = (params: GetEvidenceParams | null | undefined) => [
  "ai-evidence",
  params,
];

export const useGetEvidence = (
  params: GetEvidenceParams | null | undefined,
  options?: { enabled?: boolean }
) =>
  useQuery<GetEvidenceResponse, Error>({
    queryKey: AI_EVIDENCE_QUERY_KEY(params),
    queryFn: () => getEvidence(params as GetEvidenceParams),
    enabled: (options?.enabled ?? true) && !!params,
  });
