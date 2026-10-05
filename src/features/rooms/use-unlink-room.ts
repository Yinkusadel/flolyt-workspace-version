import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  unlinkRoom,
  type UnlinkRoomPayload,
  type UnlinkRoomResponse,
} from "@/services/api/rooms/unlink-room";

interface UseUnlinkRoomOptions {
  onSuccess?: () => void;
}

const useUnlinkRoom = (options?: UseUnlinkRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UnlinkRoomResponse, Error, UnlinkRoomPayload>({
    mutationFn: unlinkRoom,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to unlink the rooms");
        return;
      }

      toast.success("Rooms unlinked");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-merge-candidates", variables.roomId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unlink the rooms");
    },
  });

  return {
    unlinkRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUnlinkRoom;
