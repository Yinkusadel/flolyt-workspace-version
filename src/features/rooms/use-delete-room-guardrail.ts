import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteRoomGuardrail,
  type DeleteRoomGuardrailPayload,
  type DeleteRoomGuardrailResponse,
} from "@/services/api/rooms/delete-room-guardrail";

interface UseDeleteRoomGuardrailOptions {
  onSuccess?: () => void;
}

const useDeleteRoomGuardrail = (options?: UseDeleteRoomGuardrailOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteRoomGuardrailResponse, Error, DeleteRoomGuardrailPayload>({
    mutationFn: deleteRoomGuardrail,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to remove the guardrail");
        return;
      }

      toast.success("Guardrail removed");
      queryClient.invalidateQueries({ queryKey: ["room-guardrails", variables.roomId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove the guardrail");
    },
  });

  return {
    deleteRoomGuardrail: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeleteRoomGuardrail;
