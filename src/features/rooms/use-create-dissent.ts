import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createDissent,
  type CreateDissentPayload,
  type CreateDissentResponse,
} from "@/services/api/rooms/create-dissent";

interface UseCreateDissentOptions {
  onSuccess?: (dissentId: string) => void;
}

const useCreateDissent = (options?: UseCreateDissentOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateDissentResponse, Error, CreateDissentPayload>({
    mutationFn: createDissent,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to record the objection");
        return;
      }

      toast.success("Objection recorded");
      queryClient.invalidateQueries({ queryKey: ["room-decision", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["room-dissent-all"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record the objection");
    },
  });

  return {
    createDissent: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateDissent;
