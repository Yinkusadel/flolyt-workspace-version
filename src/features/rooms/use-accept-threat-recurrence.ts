import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  acceptThreatRecurrence,
  type AcceptThreatRecurrencePayload,
  type AcceptThreatRecurrenceResponse,
} from "@/services/api/rooms/accept-threat-recurrence";

interface UseAcceptThreatRecurrenceOptions {
  onSuccess?: (data: string) => void;
}

const useAcceptThreatRecurrence = (options?: UseAcceptThreatRecurrenceOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AcceptThreatRecurrenceResponse, Error, AcceptThreatRecurrencePayload>({
    mutationFn: acceptThreatRecurrence,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to accept the recurrence");
        return;
      }

      toast.success("Recurrence accepted");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to accept the recurrence");
    },
  });

  return {
    acceptThreatRecurrence: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useAcceptThreatRecurrence;
