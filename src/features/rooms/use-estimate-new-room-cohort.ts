import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  estimateNewRoomCohort,
  type EstimateNewRoomCohortPayload,
  type EstimateNewRoomCohortResponse,
} from "@/services/api/rooms/estimate-new-room-cohort";

const useEstimateNewRoomCohort = () => {
  const mutation = useMutation<
    EstimateNewRoomCohortResponse,
    Error,
    EstimateNewRoomCohortPayload
  >({
    mutationFn: estimateNewRoomCohort,
    onError: (error) => {
      toast.error(error.message || "Failed to estimate the cohort");
    },
  });

  return {
    estimateCohort: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    estimate: mutation.data?.data ?? null,
    reset: mutation.reset,
  };
};

export default useEstimateNewRoomCohort;
