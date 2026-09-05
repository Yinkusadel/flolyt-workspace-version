import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  watchRoom,
  type WatchRoomPayload,
  type WatchRoomResponse,
} from "@/services/api/rooms/watch-room";

interface UseWatchRoomOptions {
  onSuccess?: () => void;
}

const useWatchRoom = (options?: UseWatchRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<WatchRoomResponse, Error, WatchRoomPayload>({
    mutationFn: watchRoom,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to watch the room");
        return;
      }

      toast.success("Now watching this room");
      queryClient.invalidateQueries({ queryKey: ["room-subscriptions"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to watch the room");
    },
  });

  return {
    watchRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useWatchRoom;
