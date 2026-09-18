import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  snoozeInboxItem,
  type SnoozeInboxItemPayload,
  type SnoozeInboxItemResponse,
} from "@/services/api/inbox/snooze-inbox-item";

const useSnoozeInboxItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SnoozeInboxItemResponse, Error, SnoozeInboxItemPayload>({
    mutationFn: snoozeInboxItem,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to snooze the item");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to snooze the item");
    },
  });

  return {
    snoozeInboxItem: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useSnoozeInboxItem;
