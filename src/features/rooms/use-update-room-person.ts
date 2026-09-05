import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateRoomPerson,
  type UpdateRoomPersonPayload,
  type UpdateRoomPersonResponse,
} from "@/services/api/rooms/update-room-person";

interface UseUpdateRoomPersonOptions {
  onSuccess?: (memberCount: number) => void;
}

const useUpdateRoomPerson = (options?: UseUpdateRoomPersonOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateRoomPersonResponse, Error, UpdateRoomPersonPayload>({
    mutationFn: updateRoomPerson,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the room member");
        return;
      }

      toast.success("Room member updated");
      queryClient.invalidateQueries({ queryKey: ["room-people", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the room member");
    },
  });

  return {
    updateRoomPerson: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateRoomPerson;
