import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRoom,
  type CreateRoomPayload,
  type CreateRoomResponse,
} from "@/services/api/rooms/create-room";

interface UseCreateRoomOptions {
  onSuccess?: (roomId: string) => void;
}

const useCreateRoom = (options?: UseCreateRoomOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateRoomResponse, Error, CreateRoomPayload>({
    mutationFn: createRoom,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to open the room");
        return;
      }

      toast.success("Room opened");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open the room");
    },
  });

  return {
    createRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateRoom;
