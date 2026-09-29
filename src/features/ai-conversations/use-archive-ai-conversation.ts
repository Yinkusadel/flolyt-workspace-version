import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { archiveAiConversation } from "@/services/api/ai-conversations/archive-conversation";

export const useArchiveAiConversation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const response = await archiveAiConversation(id);
      if (!response.succeeded) throw new Error(response.messages?.[0] || "Failed to delete conversation");
      return response.data;
    },
    onSuccess: (_data, id) => {
      toast.success("Conversation deleted");
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversation", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete conversation");
    },
  });

  return {
    archiveConversation: mutation.mutate,
    isPending: mutation.isPending,
  };
};
