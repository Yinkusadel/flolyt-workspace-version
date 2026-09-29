import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRoomView,
  type CreateRoomViewPayload,
  type CreateRoomViewResponse,
} from "@/services/api/rooms/create-room-view";
import { ROOM_VIEWS_QUERY_KEY } from "@/features/rooms/use-get-room-views";

interface UseCreateRoomViewOptions {
  onSuccess?: (viewId: string) => void;
}

const useCreateRoomView = (options?: UseCreateRoomViewOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateRoomViewResponse, Error, CreateRoomViewPayload>({
    mutationFn: createRoomView,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to save the view");
        return;
      }

      toast.success("View saved");
      queryClient.invalidateQueries({ queryKey: ROOM_VIEWS_QUERY_KEY });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save the view");
    },
  });

  return {
    createRoomView: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateRoomView;
