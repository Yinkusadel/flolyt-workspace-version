import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  withdrawDissent,
  type WithdrawDissentResponse,
} from "@/services/api/rooms/withdraw-dissent";

interface UseWithdrawDissentOptions {
  onSuccess?: () => void;
}

const useWithdrawDissent = (options?: UseWithdrawDissentOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<WithdrawDissentResponse, Error, string>({
    mutationFn: withdrawDissent,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to withdraw the objection");
        return;
      }

      toast.success("Objection withdrawn");
      queryClient.invalidateQueries({ queryKey: ["room-decision"] });
      queryClient.invalidateQueries({ queryKey: ["room-dissent-all"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to withdraw the objection");
    },
  });

  return {
    withdrawDissent: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useWithdrawDissent;
