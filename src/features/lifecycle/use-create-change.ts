import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createChange, type CreateChangePayload, type CreateChangeResponse } from "@/services/api/lifecycle/create-change";

interface UseCreateChangeOptions {
  onSuccess?: (changeId: string) => void;
}

const useCreateChange = (options?: UseCreateChangeOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateChangeResponse, Error, CreateChangePayload>({
    mutationFn: createChange,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to record the change");
        return;
      }

      toast.success("Change recorded");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage-change-registry"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record the change");
    },
  });

  return {
    createChange: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateChange;
