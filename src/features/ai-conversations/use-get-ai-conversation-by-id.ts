import { useQuery } from "@tanstack/react-query";
import {
  getAiConversationById,
  type GetAiConversationByIdResponse,
} from "@/services/api/ai-conversations/get-conversation-by-id";

export const AI_CONVERSATION_QUERY_KEY = (id: string) => ["ai-conversation", id];

export const useGetAiConversationById = (id: string | undefined) =>
  useQuery<GetAiConversationByIdResponse, Error>({
    queryKey: AI_CONVERSATION_QUERY_KEY(id ?? ""),
    queryFn: () => getAiConversationById(id as string),
    enabled: !!id,
  });
