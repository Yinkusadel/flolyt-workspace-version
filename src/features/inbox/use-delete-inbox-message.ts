import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteInboxMessage,
  type DeleteInboxMessageResponse,
} from "@/services/api/inbox/delete-inbox-message";
import { INBOX_THREAD_QUERY_KEY } from "@/features/inbox/use-get-inbox-thread";
import { INBOX_SENT_QUERY_KEY } from "@/features/inbox/use-get-inbox-sent";

interface UseDeleteInboxMessageOptions {
  threadId?: string;
}

const useDeleteInboxMessage = (options?: UseDeleteInboxMessageOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteInboxMessageResponse, Error, string>({
    mutationFn: deleteInboxMessage,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to delete the message");
        return;
      }

      if (options?.threadId) {
        queryClient.invalidateQueries({ queryKey: INBOX_THREAD_QUERY_KEY(options.threadId) });
      }
      queryClient.invalidateQueries({ queryKey: INBOX_SENT_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete the message");
    },
  });

  return {
    deleteInboxMessage: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeleteInboxMessage;
