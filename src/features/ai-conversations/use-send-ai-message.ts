import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  sendAiMessage,
  type SendAiMessagePayload,
  type SendAiMessageResponse,
} from "@/services/api/ai-conversations/send-message";

interface UseSendAiMessageOptions {
  onSuccess?: (conversationId: string) => void;
}

const useSendAiMessage = (options?: UseSendAiMessageOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SendAiMessageResponse, Error, SendAiMessagePayload>({
    mutationFn: sendAiMessage,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to send message");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
      options?.onSuccess?.(data.data.conversationId);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  return {
    sendMessage: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useSendAiMessage;
