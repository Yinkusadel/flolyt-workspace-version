import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  closeVerifiedCase,
  type CloseVerifiedCasePayload,
  type CloseVerifiedCaseResponse,
} from "@/services/api/rooms/close-verified-case";

interface UseCloseVerifiedCaseOptions {
  onSuccess?: (data: unknown) => void;
}

const useCloseVerifiedCase = (options?: UseCloseVerifiedCaseOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CloseVerifiedCaseResponse, Error, CloseVerifiedCasePayload>({
    mutationFn: closeVerifiedCase,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to close the verified case");
        return;
      }

      toast.success("Verified case closed");
      queryClient.invalidateQueries({ queryKey: ["room-verifications", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["room-threat-monitoring", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to close the verified case");
    },
  });

  return {
    closeVerifiedCase: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCloseVerifiedCase;
