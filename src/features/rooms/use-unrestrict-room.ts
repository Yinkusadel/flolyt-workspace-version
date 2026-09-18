import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  unrestrictRoom,
  type UnrestrictRoomResponse,
} from "@/services/api/rooms/unrestrict-room";

interface UseUnrestrictRoomOptions {
  onSuccess?: (memberCount: number) => void;
}

const useUnrestrictRoom = (options?: UseUnrestrictRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UnrestrictRoomResponse, Error, string>({
    mutationFn: unrestrictRoom,
    onSuccess: (data, roomId) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to open the room back up");
        return;
      }

      toast.success("Room opened back up to the workspace");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-people", roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open the room back up");
    },
  });

  return {
    unrestrictRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUnrestrictRoom;
