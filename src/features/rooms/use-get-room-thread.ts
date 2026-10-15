import { useQuery } from "@tanstack/react-query";
import {
  getAiConversationById,
  type GetAiConversationByIdResponse,
} from "@/services/api/ai-conversations/get-conversation-by-id";

export const ROOM_THREAD_QUERY_KEY = (conversationId: string) => ["room-thread", conversationId];

/**
 * The Room's own conversation (`GET /api/v3/conversations/{conversationId}`): the thread's BOOTSTRAP history, read once per open. Own key
 * and own hook so the AI chat panel's cache and code are untouched. After this, the live feed (`use-room-live-thread.ts`) keeps it
 * current, so this query never polls and never refetches by itself.
 */
export const useGetRoomThread = (conversationId: string | null) =>
  useQuery<GetAiConversationByIdResponse, Error>({
    queryKey: ROOM_THREAD_QUERY_KEY(conversationId ?? ""),
    queryFn: () => getAiConversationById(conversationId as string),
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
