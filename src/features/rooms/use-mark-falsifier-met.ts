import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markFalsifierMet,
  type MarkFalsifierMetPayload,
  type MarkFalsifierMetResponse,
} from "@/services/api/rooms/mark-falsifier-met";

interface UseMarkFalsifierMetOptions {
  onSuccess?: () => void;
}

const useMarkFalsifierMet = (options?: UseMarkFalsifierMetOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<MarkFalsifierMetResponse, Error, MarkFalsifierMetPayload>({
    mutationFn: markFalsifierMet,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to mark the falsifier as met");
        return;
      }

      toast.success("Falsifier marked as met");
      queryClient.invalidateQueries({ queryKey: ["room-evidence", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["room-decision", variables.roomId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark the falsifier as met");
    },
  });

  return {
    markFalsifierMet: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useMarkFalsifierMet;
