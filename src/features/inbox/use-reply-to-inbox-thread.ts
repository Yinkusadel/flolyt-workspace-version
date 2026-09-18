import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  replyToInboxThread,
  type ReplyToInboxThreadPayload,
  type ReplyToInboxThreadResponse,
} from "@/services/api/inbox/reply-to-inbox-thread";
import { INBOX_THREAD_QUERY_KEY } from "@/features/inbox/use-get-inbox-thread";

interface UseReplyToInboxThreadOptions {
  onSuccess?: (messageId: string) => void;
}

const useReplyToInboxThread = (options?: UseReplyToInboxThreadOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReplyToInboxThreadResponse, Error, ReplyToInboxThreadPayload>({
    mutationFn: replyToInboxThread,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to send the reply");
        return;
      }

      queryClient.invalidateQueries({ queryKey: INBOX_THREAD_QUERY_KEY(variables.threadId) });
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send the reply");
    },
  });

  return {
    replyToInboxThread: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useReplyToInboxThread;
