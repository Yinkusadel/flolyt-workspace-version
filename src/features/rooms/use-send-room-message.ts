import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  sendRoomMessage,
  type SendRoomMessagePayload,
  type SendRoomMessageReceipt,
} from "@/services/api/rooms/send-room-message";
import { ROOM_THREAD_QUERY_KEY } from "@/features/rooms/use-get-room-thread";

interface UseSendRoomMessageOptions {
  onSuccess?: (receipt: SendRoomMessageReceipt) => void;
}

const useSendRoomMessage = (options?: UseSendRoomMessageOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SendRoomMessageReceipt, Error, SendRoomMessagePayload>({
    mutationFn: sendRoomMessage,
    onSuccess: (receipt, variables) => {
      queryClient.invalidateQueries({ queryKey: ROOM_THREAD_QUERY_KEY(variables.conversationId) });
      options?.onSuccess?.(receipt);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send the message");
    },
  });

  return {
    sendRoomMessage: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useSendRoomMessage;
