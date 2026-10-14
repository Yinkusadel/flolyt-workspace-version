import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getConversationPreferences,
  setConversationPreferences,
  type ConversationPreferencesResponse,
} from "@/services/api/ai-conversations/conversation-preferences";
import type { ConversationReplyMode } from "@/features/ai-conversations/ai-conversation-types";

export const CONVERSATION_PREFERENCES_QUERY_KEY = (conversationId: string) => ["conversation-preferences", conversationId];

/** The caller's saved reply mode for the Room thread's conversation. Never refetches by itself: it is read once per open. */
export const useGetConversationReplyMode = (conversationId: string | null) =>
  useQuery<ConversationPreferencesResponse, Error>({
    queryKey: CONVERSATION_PREFERENCES_QUERY_KEY(conversationId ?? ""),
    queryFn: () => getConversationPreferences(conversationId as string),
    enabled: !!conversationId,
    staleTime: Infinity,
    retry: false,
  });

export const useSetConversationReplyMode = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ConversationPreferencesResponse, Error, { conversationId: string; replyMode: ConversationReplyMode }>({
    mutationFn: setConversationPreferences,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(CONVERSATION_PREFERENCES_QUERY_KEY(variables.conversationId), data);
    },
    onError: () => {
      toast.error("Your choice applies here, but it wasn't saved for your other devices");
    },
  });
  return { setReplyMode: mutation.mutate };
};
