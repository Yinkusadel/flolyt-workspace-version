import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRoomView, type DeleteRoomViewResponse } from "@/services/api/rooms/delete-room-view";
import { ROOM_VIEWS_QUERY_KEY } from "@/features/rooms/use-get-room-views";

interface UseDeleteRoomViewOptions {
  onSuccess?: () => void;
}

const useDeleteRoomView = (options?: UseDeleteRoomViewOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteRoomViewResponse, Error, string>({
    mutationFn: deleteRoomView,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to delete the view");
        return;
      }

      toast.success("View deleted");
      queryClient.invalidateQueries({ queryKey: ROOM_VIEWS_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete the view");
    },
  });

  return {
    deleteRoomView: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeleteRoomView;
