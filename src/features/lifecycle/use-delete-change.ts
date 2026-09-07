import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteChange, type DeleteChangeResponse } from "@/services/api/lifecycle/delete-change";

interface UseDeleteChangeOptions {
  onSuccess?: () => void;
}

const useDeleteChange = (options?: UseDeleteChangeOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteChangeResponse, Error, string>({
    mutationFn: deleteChange,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to remove the change");
        return;
      }

      toast.success("Change removed");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage-change-registry"] });
      queryClient.invalidateQueries({ queryKey: ["lifecycle-change-impact"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove the change");
    },
  });

  return {
    deleteChange: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeleteChange;
