import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  acceptConveningProposal,
  type AcceptConveningProposalResponse,
} from "@/services/api/rooms/accept-convening-proposal";

interface UseAcceptConveningProposalOptions {
  onSuccess?: (roomId: string) => void;
}

const useAcceptConveningProposal = (options?: UseAcceptConveningProposalOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AcceptConveningProposalResponse, Error, string>({
    mutationFn: acceptConveningProposal,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to accept the convening proposal");
        return;
      }

      toast.success("Room opened");
      queryClient.invalidateQueries({ queryKey: ["room-convening"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to accept the convening proposal");
    },
  });

  return {
    acceptConveningProposal: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useAcceptConveningProposal;
