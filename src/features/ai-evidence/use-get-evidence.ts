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
    // A 404 here is a real, definitive answer per the doc ("unavailable or inaccessible"), not a
    // transient failure — retrying it 3x with backoff (React Query's default) just delays showing
    // that honest message for no benefit. Confirmed live 2026-09-28: a 404'd reference sat on
    // "Loading…" for several seconds before this was added.
    retry: false,
  });
