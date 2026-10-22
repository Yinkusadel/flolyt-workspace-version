import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unwatchRoom, type UnwatchRoomResponse } from "@/services/api/rooms/unwatch-room";

interface UseUnwatchRoomOptions {
  onSuccess?: () => void;
}

const useUnwatchRoom = (options?: UseUnwatchRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UnwatchRoomResponse, Error, string>({
    mutationFn: unwatchRoom,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to unwatch the room");
        return;
      }

      toast.success("Stopped watching this room");
      queryClient.invalidateQueries({ queryKey: ["room-subscriptions"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unwatch the room");
    },
  });

  return {
    unwatchRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUnwatchRoom;
