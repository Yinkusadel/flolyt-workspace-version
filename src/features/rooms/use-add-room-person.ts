import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRoomPerson,
  type AddRoomPersonPayload,
  type AddRoomPersonResponse,
} from "@/services/api/rooms/add-room-person";

interface UseAddRoomPersonOptions {
  onSuccess?: (memberCount: number) => void;
}

const useAddRoomPerson = (options?: UseAddRoomPersonOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AddRoomPersonResponse, Error, AddRoomPersonPayload>({
    mutationFn: addRoomPerson,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to add the person to the room");
        return;
      }

      toast.success("Person added to the room");
      queryClient.invalidateQueries({ queryKey: ["room-people", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add the person to the room");
    },
  });

  return {
    addRoomPerson: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useAddRoomPerson;
