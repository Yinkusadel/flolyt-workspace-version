import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unmergeRoom, type UnmergeRoomResponse } from "@/services/api/rooms/unmerge-room";

interface UseUnmergeRoomOptions {
  onSuccess?: () => void;
}

const useUnmergeRoom = (options?: UseUnmergeRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UnmergeRoomResponse, Error, string>({
    mutationFn: unmergeRoom,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to unmerge the room");
        return;
      }

      toast.success("Room unmerged");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unmerge the room");
    },
  });

  return {
    unmergeRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUnmergeRoom;
