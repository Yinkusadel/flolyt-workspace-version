import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRoomAgent,
  type AddRoomAgentPayload,
  type AddRoomAgentResponse,
} from "@/services/api/rooms/add-room-agent";

interface UseAddRoomAgentOptions {
  onSuccess?: () => void;
}

const useAddRoomAgent = (options?: UseAddRoomAgentOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AddRoomAgentResponse, Error, AddRoomAgentPayload>({
    mutationFn: addRoomAgent,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to add the agent to the room");
        return;
      }

      toast.success("Agent added to the room");
      queryClient.invalidateQueries({ queryKey: ["room-people", variables.roomId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add the agent to the room");
    },
  });

  return {
    addRoomAgent: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useAddRoomAgent;
