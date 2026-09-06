import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createInstrumentationRequest,
  type CreateInstrumentationRequestPayload,
  type CreateInstrumentationRequestResponse,
} from "@/services/api/lifecycle/create-instrumentation-request";
import { INSTRUMENTATION_QUERY_KEY } from "@/features/lifecycle/use-get-instrumentation";

interface UseCreateInstrumentationRequestOptions {
  onSuccess?: (obligationId: string) => void;
}

const useCreateInstrumentationRequest = (options?: UseCreateInstrumentationRequestOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateInstrumentationRequestResponse,
    Error,
    CreateInstrumentationRequestPayload
  >({
    mutationFn: createInstrumentationRequest,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to raise the instrumentation request");
        return;
      }

      toast.success("Instrumentation request raised");
      queryClient.invalidateQueries({ queryKey: INSTRUMENTATION_QUERY_KEY });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to raise the instrumentation request");
    },
  });

  return {
    raiseRequest: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateInstrumentationRequest;
