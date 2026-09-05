import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  mergeRoom,
  type MergeRoomPayload,
  type MergeRoomResponse,
} from "@/services/api/rooms/merge-room";

interface UseMergeRoomOptions {
  onSuccess?: (survivingRoomId: string) => void;
}

const useMergeRoom = (options?: UseMergeRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<MergeRoomResponse, Error, MergeRoomPayload>({
    mutationFn: mergeRoom,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to merge the rooms");
        return;
      }

      toast.success("Rooms merged");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-merge-candidates", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to merge the rooms");
    },
  });

  return {
    mergeRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useMergeRoom;
