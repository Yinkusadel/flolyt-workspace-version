import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openRoomOnLeakageCell } from "@/services/api/leakage/open-room-on-leakage-cell";

export const useOpenRoomOnLeakageCell = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openRoomOnLeakageCell,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to open a room on this cell");
        return;
      }
      toast.success("Room opened");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["leakage-cell"] });
      queryClient.invalidateQueries({ queryKey: ["leakage"] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to open a room on this cell"),
  });
};
