import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  decideRoomDecision,
  type DecideRoomDecisionPayload,
  type DecideRoomDecisionResponse,
} from "@/services/api/rooms/decide-room-decision";

interface UseDecideRoomDecisionOptions {
  onSuccess?: (revisionNumber: number) => void;
}

const useDecideRoomDecision = (options?: UseDecideRoomDecisionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DecideRoomDecisionResponse, Error, DecideRoomDecisionPayload>({
    mutationFn: decideRoomDecision,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to mark the decision made");
        return;
      }

      toast.success("Decision marked as made");
      queryClient.invalidateQueries({ queryKey: ["room-decision", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark the decision made");
    },
  });

  return {
    decideRoomDecision: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDecideRoomDecision;
