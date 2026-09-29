import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markInboxRead,
  type MarkInboxReadPayload,
  type MarkInboxReadResponse,
} from "@/services/api/inbox/mark-inbox-read";

const useMarkInboxRead = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<MarkInboxReadResponse, Error, MarkInboxReadPayload>({
    mutationFn: markInboxRead,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to mark the item read");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark the item read");
    },
  });

  return {
    markInboxRead: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useMarkInboxRead;
