import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteInboxDraft,
  type DeleteInboxDraftResponse,
} from "@/services/api/inbox/delete-inbox-draft";

const useDeleteInboxDraft = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteInboxDraftResponse, Error, string>({
    mutationFn: deleteInboxDraft,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to delete the draft");
        return;
      }

      toast.success("Draft deleted");
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete the draft");
    },
  });

  return {
    deleteInboxDraft: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeleteInboxDraft;
