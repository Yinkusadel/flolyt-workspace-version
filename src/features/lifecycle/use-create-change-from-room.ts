import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createChangeFromRoom,
  type CreateChangeFromRoomPayload,
  type CreateChangeFromRoomResponse,
} from "@/services/api/lifecycle/create-change-from-room";

interface UseCreateChangeFromRoomOptions {
  onSuccess?: (changeId: string) => void;
}

const useCreateChangeFromRoom = (options?: UseCreateChangeFromRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateChangeFromRoomResponse, Error, CreateChangeFromRoomPayload>({
    mutationFn: createChangeFromRoom,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to promote the room's decision to a change");
        return;
      }

      toast.success("Room decision promoted to a change");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-stage-change-registry"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to promote the room's decision to a change");
    },
  });

  return {
    createChangeFromRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateChangeFromRoom;
