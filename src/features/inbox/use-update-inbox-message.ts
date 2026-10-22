import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateInboxMessage,
  type UpdateInboxMessagePayload,
  type UpdateInboxMessageResponse,
} from "@/services/api/inbox/update-inbox-message";
import { INBOX_THREAD_QUERY_KEY } from "@/features/inbox/use-get-inbox-thread";
import { INBOX_SENT_QUERY_KEY } from "@/features/inbox/use-get-inbox-sent";

interface UseUpdateInboxMessageOptions {
  threadId?: string;
}

const useUpdateInboxMessage = (options?: UseUpdateInboxMessageOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateInboxMessageResponse, Error, UpdateInboxMessagePayload>({
    mutationFn: updateInboxMessage,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the message");
        return;
      }

      if (options?.threadId) {
        queryClient.invalidateQueries({ queryKey: INBOX_THREAD_QUERY_KEY(options.threadId) });
      }
      queryClient.invalidateQueries({ queryKey: INBOX_SENT_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the message");
    },
  });

  return {
    updateInboxMessage: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateInboxMessage;
