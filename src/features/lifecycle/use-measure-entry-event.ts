import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { measureEntryEvent, type MeasureEntryEventResponse } from "@/services/api/lifecycle/measure-entry-event";

interface UseMeasureEntryEventOptions {
  onSuccess?: (count: number) => void;
}

// See the ❓ note in measure-entry-event.ts — the endpoint's documented request shape has no
// field identifying which candidate event to count, so this hook only exposes `force` for now.
const useMeasureEntryEvent = (options?: UseMeasureEntryEventOptions) => {
  const mutation = useMutation<MeasureEntryEventResponse, Error, boolean | void>({
    mutationFn: (force) => measureEntryEvent(force ?? false),
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to measure the entry event");
        return;
      }

      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to measure the entry event");
    },
  });

  return {
    measure: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useMeasureEntryEvent;
