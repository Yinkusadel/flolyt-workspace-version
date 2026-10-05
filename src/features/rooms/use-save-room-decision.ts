import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  saveRoomDecision,
  type SaveRoomDecisionPayload,
  type SaveRoomDecisionResponse,
} from "@/services/api/rooms/save-room-decision";

interface UseSaveRoomDecisionOptions {
  onSuccess?: (revisionNumber: number) => void;
}

const useSaveRoomDecision = (options?: UseSaveRoomDecisionOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SaveRoomDecisionResponse, Error, SaveRoomDecisionPayload>({
    mutationFn: saveRoomDecision,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to save the decision");
        return;
      }

      toast.success("Decision saved");
      queryClient.invalidateQueries({ queryKey: ["room-decision", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save the decision");
    },
  });

  return {
    saveRoomDecision: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useSaveRoomDecision;
