import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  reviseRoomResolutionPlan,
  type ReviseRoomResolutionPlanPayload,
  type ReviseRoomResolutionPlanResponse,
} from "@/services/api/rooms/revise-room-resolution-plan";

interface UseReviseRoomResolutionPlanOptions {
  onSuccess?: (data: unknown) => void;
}

const useReviseRoomResolutionPlan = (options?: UseReviseRoomResolutionPlanOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReviseRoomResolutionPlanResponse, Error, ReviseRoomResolutionPlanPayload>({
    mutationFn: reviseRoomResolutionPlan,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to revise the resolution plan");
        return;
      }

      toast.success("Resolution plan revised");
      queryClient.invalidateQueries({ queryKey: ["room-resolution-plan", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revise the resolution plan");
    },
  });

  return {
    reviseRoomResolutionPlan: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useReviseRoomResolutionPlan;
