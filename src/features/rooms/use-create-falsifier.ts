import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createFalsifier,
  type CreateFalsifierPayload,
  type CreateFalsifierResponse,
} from "@/services/api/rooms/create-falsifier";

interface UseCreateFalsifierOptions {
  onSuccess?: (falsifierRoomId: string) => void;
}

const useCreateFalsifier = (options?: UseCreateFalsifierOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateFalsifierResponse, Error, CreateFalsifierPayload>({
    mutationFn: createFalsifier,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to add the falsifier");
        return;
      }

      toast.success("Falsifier added");
      queryClient.invalidateQueries({ queryKey: ["room-evidence", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["room-decision", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add the falsifier");
    },
  });

  return {
    createFalsifier: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateFalsifier;
