import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  closeInstrumentationRequest,
  type CloseInstrumentationRequestPayload,
  type CloseInstrumentationRequestResponse,
} from "@/services/api/lifecycle/close-instrumentation-request";
import { INSTRUMENTATION_QUERY_KEY } from "@/features/lifecycle/use-get-instrumentation";

interface UseCloseInstrumentationRequestOptions {
  onSuccess?: () => void;
}

const useCloseInstrumentationRequest = (options?: UseCloseInstrumentationRequestOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CloseInstrumentationRequestResponse,
    Error,
    CloseInstrumentationRequestPayload
  >({
    mutationFn: closeInstrumentationRequest,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to close the instrumentation request");
        return;
      }

      toast.success(variables.resolved ? "Request marked delivered" : "Request withdrawn");
      queryClient.invalidateQueries({ queryKey: INSTRUMENTATION_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to close the instrumentation request");
    },
  });

  return {
    closeRequest: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCloseInstrumentationRequest;
