import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { updateRoomCap, type UpdateRoomCapPayload, type UpdateRoomCapResponse } from "@/services/api/lifecycle/update-room-cap";

interface UseUpdateRoomCapOptions {
  onSuccess?: (cap: number) => void;
}

const useUpdateRoomCap = (options?: UseUpdateRoomCapOptions) => {
  const mutation = useMutation<UpdateRoomCapResponse, Error, UpdateRoomCapPayload>({
    mutationFn: updateRoomCap,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the room cap");
        return;
      }

      toast.success("Room cap updated");
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the room cap");
    },
  });

  return {
    updateRoomCap: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateRoomCap;
