import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  openRoomOnLeakageCell,
  type OpenRoomOnLeakageCellPayload,
  type OpenRoomOnLeakageCellResponse,
} from "@/services/api/rooms/open-room-on-leakage-cell";

interface UseOpenRoomOnLeakageCellOptions {
  onSuccess?: (roomId: string) => void;
}

const useOpenRoomOnLeakageCell = (options?: UseOpenRoomOnLeakageCellOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    OpenRoomOnLeakageCellResponse,
    Error,
    OpenRoomOnLeakageCellPayload
  >({
    mutationFn: openRoomOnLeakageCell,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to open a room on this cell");
        return;
      }

      toast.success("Room opened");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open a room on this cell");
    },
  });

  return {
    openRoomOnLeakageCell: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useOpenRoomOnLeakageCell;
