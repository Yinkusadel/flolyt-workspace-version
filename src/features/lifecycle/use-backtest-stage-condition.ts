import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  backtestStageCondition,
  type BacktestStageConditionData,
  type BacktestStageConditionPayload,
  type BacktestStageConditionResponse,
} from "@/services/api/lifecycle/backtest-stage-condition";

interface UseBacktestStageConditionOptions {
  onSuccess?: (result: BacktestStageConditionData) => void;
}

const useBacktestStageCondition = (options?: UseBacktestStageConditionOptions) => {
  const mutation = useMutation<BacktestStageConditionResponse, Error, BacktestStageConditionPayload>({
    mutationFn: backtestStageCondition,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to backtest the condition");
        return;
      }

      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to backtest the condition");
    },
  });

  return {
    backtest: mutation.mutate,
    backtestResult: mutation.data?.data,
    isPending: mutation.isPending,
  };
};

export default useBacktestStageCondition;
