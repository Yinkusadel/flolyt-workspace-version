import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openRoomOnLeakageCase } from "@/services/api/leakage/open-room-on-leakage-case";

export const useOpenRoomOnLeakageCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openRoomOnLeakageCase,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to open a room on this case");
        return;
      }
      toast.success("Room opened");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["leakage-case"] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to open a room on this case"),
  });
};
