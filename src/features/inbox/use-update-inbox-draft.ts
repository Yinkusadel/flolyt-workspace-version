import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateInboxDraft,
  type UpdateInboxDraftPayload,
  type UpdateInboxDraftResponse,
} from "@/services/api/inbox/update-inbox-draft";

const useUpdateInboxDraft = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateInboxDraftResponse, Error, UpdateInboxDraftPayload>({
    mutationFn: updateInboxDraft,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the draft");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      queryClient.invalidateQueries({ queryKey: ["inbox-drafts"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the draft");
    },
  });

  return {
    updateInboxDraft: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateInboxDraft;
