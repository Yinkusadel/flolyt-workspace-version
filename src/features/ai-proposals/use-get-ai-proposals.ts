import { useQuery } from "@tanstack/react-query";
import {
  getAiProposals,
  type GetAiProposalsParams,
  type GetAiProposalsResponse,
} from "@/services/api/ai-proposals/get-ai-proposals";

export const AI_PROPOSALS_QUERY_KEY = (params?: GetAiProposalsParams) => ["ai-proposals", params];

export const useGetAiProposals = (params?: GetAiProposalsParams) =>
  useQuery<GetAiProposalsResponse, Error>({
    queryKey: AI_PROPOSALS_QUERY_KEY(params),
    queryFn: () => getAiProposals(params),
    enabled: Boolean(params?.conversationId),
  });
