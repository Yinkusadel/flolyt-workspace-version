import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { linkRoom, type LinkRoomPayload, type LinkRoomResponse } from "@/services/api/rooms/link-room";

interface UseLinkRoomOptions {
  onSuccess?: () => void;
}

const useLinkRoom = (options?: UseLinkRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<LinkRoomResponse, Error, LinkRoomPayload>({
    mutationFn: linkRoom,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to link the rooms");
        return;
      }

      toast.success("Rooms linked");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-merge-candidates", variables.roomId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to link the rooms");
    },
  });

  return {
    linkRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useLinkRoom;
