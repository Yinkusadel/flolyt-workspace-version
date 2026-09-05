import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  requestThirdReading,
  type RequestThirdReadingPayload,
  type RequestThirdReadingResponse,
} from "@/services/api/rooms/request-third-reading";

interface UseRequestThirdReadingOptions {
  onSuccess?: () => void;
}

const useRequestThirdReading = (options?: UseRequestThirdReadingOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RequestThirdReadingResponse, Error, RequestThirdReadingPayload>({
    mutationFn: requestThirdReading,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to request a third reading");
        return;
      }

      toast.success("Third reading requested");
      queryClient.invalidateQueries({ queryKey: ["room-conflicts"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to request a third reading");
    },
  });

  return {
    requestThirdReading: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRequestThirdReading;
