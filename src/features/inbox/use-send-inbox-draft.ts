import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  sendInboxDraft,
  type SendInboxDraftResponse,
} from "@/services/api/inbox/send-inbox-draft";

const useSendInboxDraft = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SendInboxDraftResponse, Error, string>({
    mutationFn: sendInboxDraft,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to send the draft");
        return;
      }

      toast.success("Message sent");
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send the draft");
    },
  });

  return {
    sendInboxDraft: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useSendInboxDraft;
