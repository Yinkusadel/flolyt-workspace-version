import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateInstrumentationRequestOwner,
  type UpdateInstrumentationRequestOwnerPayload,
  type UpdateInstrumentationRequestOwnerResponse,
} from "@/services/api/lifecycle/update-instrumentation-request-owner";
import { INSTRUMENTATION_QUERY_KEY } from "@/features/lifecycle/use-get-instrumentation";

interface UseUpdateInstrumentationRequestOwnerOptions {
  onSuccess?: () => void;
}

const useUpdateInstrumentationRequestOwner = (options?: UseUpdateInstrumentationRequestOwnerOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateInstrumentationRequestOwnerResponse,
    Error,
    UpdateInstrumentationRequestOwnerPayload
  >({
    mutationFn: updateInstrumentationRequestOwner,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to assign the instrumentation request's owner");
        return;
      }

      toast.success("Owner assigned");
      queryClient.invalidateQueries({ queryKey: INSTRUMENTATION_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign the instrumentation request's owner");
    },
  });

  return {
    assignOwner: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateInstrumentationRequestOwner;
