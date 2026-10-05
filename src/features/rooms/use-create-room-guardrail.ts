import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRoomGuardrail,
  type CreateRoomGuardrailPayload,
  type CreateRoomGuardrailResponse,
} from "@/services/api/rooms/create-room-guardrail";

interface UseCreateRoomGuardrailOptions {
  onSuccess?: (key: string | null) => void;
}

const useCreateRoomGuardrail = (options?: UseCreateRoomGuardrailOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateRoomGuardrailResponse, Error, CreateRoomGuardrailPayload>({
    mutationFn: createRoomGuardrail,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to add the guardrail");
        return;
      }

      toast.success("Guardrail added");
      queryClient.invalidateQueries({ queryKey: ["room-guardrails", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add the guardrail");
    },
  });

  return {
    createRoomGuardrail: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateRoomGuardrail;
