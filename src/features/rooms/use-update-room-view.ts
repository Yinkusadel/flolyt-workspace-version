import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateRoomView,
  type UpdateRoomViewPayload,
  type UpdateRoomViewResponse,
} from "@/services/api/rooms/update-room-view";
import { ROOM_VIEWS_QUERY_KEY } from "@/features/rooms/use-get-room-views";

interface UseUpdateRoomViewOptions {
  onSuccess?: () => void;
}

const useUpdateRoomView = (options?: UseUpdateRoomViewOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateRoomViewResponse, Error, UpdateRoomViewPayload>({
    mutationFn: updateRoomView,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the view");
        return;
      }

      toast.success("View updated");
      queryClient.invalidateQueries({ queryKey: ROOM_VIEWS_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the view");
    },
  });

  return {
    updateRoomView: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateRoomView;
