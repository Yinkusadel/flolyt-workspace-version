import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateRoomOwner,
  type UpdateRoomOwnerPayload,
  type UpdateRoomOwnerResponse,
} from "@/services/api/rooms/update-room-owner";

interface UseUpdateRoomOwnerOptions {
  onSuccess?: () => void;
}

const useUpdateRoomOwner = (options?: UseUpdateRoomOwnerOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateRoomOwnerResponse, Error, UpdateRoomOwnerPayload>({
    mutationFn: updateRoomOwner,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to hand off the room");
        return;
      }

      toast.success("Room handed off");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to hand off the room");
    },
  });

  return {
    updateRoomOwner: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateRoomOwner;
