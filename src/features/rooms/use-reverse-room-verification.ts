import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  reverseRoomVerification,
  type ReverseRoomVerificationPayload,
  type ReverseRoomVerificationResponse,
} from "@/services/api/rooms/reverse-room-verification";

interface UseReverseRoomVerificationOptions {
  onSuccess?: (data: unknown) => void;
}

const useReverseRoomVerification = (options?: UseReverseRoomVerificationOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReverseRoomVerificationResponse, Error, ReverseRoomVerificationPayload>({
    mutationFn: reverseRoomVerification,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to reverse the verification");
        return;
      }

      toast.success("Verification reversed");
      queryClient.invalidateQueries({ queryKey: ["room-verifications", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["verified-threat-balances"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reverse the verification");
    },
  });

  return {
    reverseRoomVerification: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useReverseRoomVerification;
