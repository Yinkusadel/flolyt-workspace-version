import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markAllInboxRead,
  type MarkAllInboxReadResponse,
} from "@/services/api/inbox/mark-all-inbox-read";

const useMarkAllInboxRead = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<MarkAllInboxReadResponse, Error, void>({
    mutationFn: markAllInboxRead,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to clear the inbox");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to clear the inbox");
    },
  });

  return {
    markAllInboxRead: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useMarkAllInboxRead;
