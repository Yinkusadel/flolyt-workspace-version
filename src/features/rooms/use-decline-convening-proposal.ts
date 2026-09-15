import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  declineConveningProposal,
  type DeclineConveningProposalPayload,
  type DeclineConveningProposalResponse,
} from "@/services/api/rooms/decline-convening-proposal";

interface UseDeclineConveningProposalOptions {
  onSuccess?: () => void;
}

const useDeclineConveningProposal = (options?: UseDeclineConveningProposalOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DeclineConveningProposalResponse,
    Error,
    DeclineConveningProposalPayload
  >({
    mutationFn: declineConveningProposal,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to decline the convening proposal");
        return;
      }

      toast.success("Proposal declined");
      queryClient.invalidateQueries({ queryKey: ["room-convening"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to decline the convening proposal");
    },
  });

  return {
    declineConveningProposal: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeclineConveningProposal;
