import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  sendRoomMessage,
  type SendRoomMessagePayload,
  type SendRoomMessageReceipt,
} from "@/services/api/rooms/send-room-message";

interface UseSendRoomMessageOptions {
  onSuccess?: (receipt: SendRoomMessageReceipt) => void;
}

const useSendRoomMessage = (options?: UseSendRoomMessageOptions) => {
  const mutation = useMutation<SendRoomMessageReceipt, Error, SendRoomMessagePayload>({
    mutationFn: sendRoomMessage,
    // No refetch here: the sent message and everything it triggers arrive through the Room feed.
    onSuccess: (receipt) => {
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
