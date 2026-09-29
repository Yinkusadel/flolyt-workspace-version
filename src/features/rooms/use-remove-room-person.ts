import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  removeRoomPerson,
  type RemoveRoomPersonPayload,
  type RemoveRoomPersonResponse,
} from "@/services/api/rooms/remove-room-person";

interface UseRemoveRoomPersonOptions {
  onSuccess?: (memberCount: number) => void;
}

const useRemoveRoomPerson = (options?: UseRemoveRoomPersonOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RemoveRoomPersonResponse, Error, RemoveRoomPersonPayload>({
    mutationFn: removeRoomPerson,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to remove the person from the room");
        return;
      }

      toast.success("Person removed from the room");
      queryClient.invalidateQueries({ queryKey: ["room-people", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove the person from the room");
    },
  });

  return {
    removeRoomPerson: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRemoveRoomPerson;
