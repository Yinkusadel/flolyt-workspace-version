import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  chooseConflictReading,
  type ChooseConflictReadingPayload,
  type ChooseConflictReadingResponse,
} from "@/services/api/rooms/choose-conflict-reading";

interface UseChooseConflictReadingOptions {
  onSuccess?: () => void;
}

const useChooseConflictReading = (options?: UseChooseConflictReadingOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ChooseConflictReadingResponse,
    Error,
    ChooseConflictReadingPayload
  >({
    mutationFn: chooseConflictReading,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to settle the conflict");
        return;
      }

      toast.success("Conflict settled");
      queryClient.invalidateQueries({ queryKey: ["room-conflicts"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to settle the conflict");
    },
  });

  return {
    chooseConflictReading: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useChooseConflictReading;
