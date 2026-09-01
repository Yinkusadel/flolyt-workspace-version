import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  escalateConflict,
  type EscalateConflictPayload,
  type EscalateConflictResponse,
} from "@/services/api/rooms/escalate-conflict";

interface UseEscalateConflictOptions {
  onSuccess?: () => void;
}

const useEscalateConflict = (options?: UseEscalateConflictOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EscalateConflictResponse, Error, EscalateConflictPayload>({
    mutationFn: escalateConflict,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to escalate the conflict");
        return;
      }

      toast.success("Conflict escalated");
      queryClient.invalidateQueries({ queryKey: ["room-conflicts"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to escalate the conflict");
    },
  });

  return {
    escalateConflict: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useEscalateConflict;
