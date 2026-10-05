import { useQuery } from "@tanstack/react-query";
import {
  getAiConversations,
  type GetAiConversationsParams,
  type GetAiConversationsResponse,
} from "@/services/api/ai-conversations/get-conversations";

export const AI_CONVERSATIONS_QUERY_KEY = (params?: GetAiConversationsParams) => [
  "ai-conversations",
  params,
];

export const useGetAiConversations = (params?: GetAiConversationsParams) =>
  useQuery<GetAiConversationsResponse, Error>({
    queryKey: AI_CONVERSATIONS_QUERY_KEY(params),
    queryFn: () => getAiConversations(params),
  });
