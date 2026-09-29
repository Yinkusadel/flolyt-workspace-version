import { useQuery } from "@tanstack/react-query";
import {
  getAiProposals,
  type GetAiProposalsParams,
  type GetAiProposalsResponse,
} from "@/services/api/ai-proposals/get-ai-proposals";

export const AI_PROPOSALS_QUERY_KEY = (params?: GetAiProposalsParams) => ["ai-proposals", params];

// No `conversationId` means "everything waiting on me across the workspace" (the Inbox use case)
// — a legitimate call, not a signal to skip fetching. Callers that only want a still-forming
// conversation's proposals (chat, before a real id exists) pass `enabled: false` explicitly
// instead of this hook guessing intent from params.
export const useGetAiProposals = (
  params?: GetAiProposalsParams,
  options?: { enabled?: boolean }
) =>
  useQuery<GetAiProposalsResponse, Error>({
    queryKey: AI_PROPOSALS_QUERY_KEY(params),
    queryFn: () => getAiProposals(params),
    enabled: options?.enabled ?? true,
  });
