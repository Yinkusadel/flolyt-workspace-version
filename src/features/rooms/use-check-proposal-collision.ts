import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  checkProposalCollision,
  type CheckProposalCollisionResponse,
} from "@/services/api/rooms/check-proposal-collision";

export interface CheckProposalCollisionVariables {
  roomId: string;
  proposalId: string;
}

const useCheckProposalCollision = () => {
  const mutation = useMutation<
    CheckProposalCollisionResponse,
    Error,
    CheckProposalCollisionVariables
  >({
    mutationFn: ({ roomId, proposalId }) => checkProposalCollision(roomId, proposalId),
    onError: (error) => {
      toast.error(error.message || "Failed to check for a send collision");
    },
  });

  return {
    checkCollision: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    /** The latest check's response; undefined until the first one returns. */
    result: mutation.data?.data,
  };
};

export default useCheckProposalCollision;
