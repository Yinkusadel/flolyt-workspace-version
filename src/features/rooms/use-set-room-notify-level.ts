import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  setRoomNotifyLevel,
  type SetRoomNotifyLevelPayload,
  type SetRoomNotifyLevelResponse,
} from "@/services/api/rooms/set-room-notify-level";

interface UseSetRoomNotifyLevelOptions {
  onSuccess?: () => void;
}

const useSetRoomNotifyLevel = (options?: UseSetRoomNotifyLevelOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SetRoomNotifyLevelResponse, Error, SetRoomNotifyLevelPayload>({
    mutationFn: setRoomNotifyLevel,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to set the notification level");
        return;
      }

      toast.success("Notification level updated");
      queryClient.invalidateQueries({ queryKey: ["room-subscriptions"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to set the notification level");
    },
  });

  return {
    setRoomNotifyLevel: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useSetRoomNotifyLevel;
