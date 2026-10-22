import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  closeRoom,
  type CloseRoomPayload,
  type CloseRoomResponse,
} from "@/services/api/rooms/close-room";

interface UseCloseRoomOptions {
  onSuccess?: (result: CloseRoomResponse["data"]) => void;
}

const useCloseRoom = (options?: UseCloseRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CloseRoomResponse, Error, CloseRoomPayload>({
    mutationFn: closeRoom,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to close the room");
        return;
      }

      toast.success("Room closed");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-log", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to close the room");
    },
  });

  return {
    closeRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCloseRoom;
