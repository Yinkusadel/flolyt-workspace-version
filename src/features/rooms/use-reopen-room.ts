import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  reopenRoom,
  type ReopenRoomPayload,
  type ReopenRoomResponse,
} from "@/services/api/rooms/reopen-room";

interface UseReopenRoomOptions {
  onSuccess?: (openingNumber: number) => void;
}

const useReopenRoom = (options?: UseReopenRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReopenRoomResponse, Error, ReopenRoomPayload>({
    mutationFn: reopenRoom,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to reopen the room");
        return;
      }

      toast.success("Room reopened");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-log", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reopen the room");
    },
  });

  return {
    reopenRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useReopenRoom;
