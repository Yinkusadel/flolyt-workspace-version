import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRoomVerification,
  type CreateRoomVerificationPayload,
  type CreateRoomVerificationResponse,
} from "@/services/api/rooms/create-room-verification";

interface UseCreateRoomVerificationOptions {
  onSuccess?: (data: unknown) => void;
}

const useCreateRoomVerification = (options?: UseCreateRoomVerificationOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateRoomVerificationResponse, Error, CreateRoomVerificationPayload>({
    mutationFn: createRoomVerification,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to verify the result");
        return;
      }

      toast.success("Verification recorded");
      queryClient.invalidateQueries({ queryKey: ["room-verifications", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["room-threat-monitoring", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify the result");
    },
  });

  return {
    createRoomVerification: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateRoomVerification;
