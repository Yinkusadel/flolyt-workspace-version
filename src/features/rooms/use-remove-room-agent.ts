import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  removeRoomAgent,
  type RemoveRoomAgentPayload,
  type RemoveRoomAgentResponse,
} from "@/services/api/rooms/remove-room-agent";

interface UseRemoveRoomAgentOptions {
  onSuccess?: () => void;
}

const useRemoveRoomAgent = (options?: UseRemoveRoomAgentOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RemoveRoomAgentResponse, Error, RemoveRoomAgentPayload>({
    mutationFn: removeRoomAgent,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to remove the agent from the room");
        return;
      }

      toast.success("Agent removed from the room");
      queryClient.invalidateQueries({ queryKey: ["room-people", variables.roomId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove the agent from the room");
    },
  });

  return {
    removeRoomAgent: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRemoveRoomAgent;
