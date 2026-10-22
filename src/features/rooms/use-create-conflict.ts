import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createConflict,
  type CreateConflictPayload,
  type CreateConflictResponse,
} from "@/services/api/rooms/create-conflict";

interface UseCreateConflictOptions {
  onSuccess?: (conflictId: string) => void;
}

const useCreateConflict = (options?: UseCreateConflictOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateConflictResponse, Error, CreateConflictPayload>({
    mutationFn: createConflict,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to raise the conflict");
        return;
      }

      toast.success("Conflict raised");
      queryClient.invalidateQueries({ queryKey: ["room-conflicts", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to raise the conflict");
    },
  });

  return {
    createConflict: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateConflict;
