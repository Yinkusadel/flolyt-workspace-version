import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  clearInboxThread,
  type ClearInboxThreadResponse,
} from "@/services/api/inbox/clear-inbox-thread";
import { INBOX_THREAD_QUERY_KEY } from "@/features/inbox/use-get-inbox-thread";
import { INBOX_SENT_QUERY_KEY } from "@/features/inbox/use-get-inbox-sent";

const useClearInboxThread = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ClearInboxThreadResponse, Error, string>({
    mutationFn: clearInboxThread,
    onSuccess: (data, threadId) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to clear the conversation");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      queryClient.invalidateQueries({ queryKey: INBOX_SENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: INBOX_THREAD_QUERY_KEY(threadId) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to clear the conversation");
    },
  });

  return {
    clearInboxThread: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useClearInboxThread;
