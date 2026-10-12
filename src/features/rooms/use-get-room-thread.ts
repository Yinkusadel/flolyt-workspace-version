import { useQuery } from "@tanstack/react-query";
import {
  getAiConversationById,
  type GetAiConversationByIdResponse,
} from "@/services/api/ai-conversations/get-conversation-by-id";

export const ROOM_THREAD_QUERY_KEY = (conversationId: string) => ["room-thread", conversationId];

/**
 * The Room's own conversation (`GET /api/v3/conversations/{conversationId}`), the thread's history. Own key and
 * own hook so the AI chat panel's cache and code are untouched.
 *
 * INTERIM: it re-reads every 5 s while the tab is visible so a reply shows up at all. The Room-wide SSE feed
 * (`GET /rooms/{roomId}/stream`) replaces this polling once the backend's reducer is in; delete `refetchInterval` then.
 */
export const useGetRoomThread = (conversationId: string | null) =>
  useQuery<GetAiConversationByIdResponse, Error>({
    queryKey: ROOM_THREAD_QUERY_KEY(conversationId ?? ""),
    queryFn: () => getAiConversationById(conversationId as string),
    enabled: !!conversationId,
    refetchInterval: 5000,
  });
