import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  restrictRoom,
  type RestrictRoomPayload,
  type RestrictRoomResponse,
} from "@/services/api/rooms/restrict-room";

interface UseRestrictRoomOptions {
  onSuccess?: (memberCount: number) => void;
}

const useRestrictRoom = (options?: UseRestrictRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RestrictRoomResponse, Error, RestrictRoomPayload>({
    mutationFn: restrictRoom,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to restrict the room");
        return;
      }

      toast.success("Room restricted");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-people", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to restrict the room");
    },
  });

  return {
    restrictRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRestrictRoom;
