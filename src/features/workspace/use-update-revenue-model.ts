import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { revenueModelSchema, type RevenueModelSchemaType } from "@/validators/workspace";
import {
  updateRevenueModel,
  type UpdateRevenueModelPayload,
  type UpdateRevenueModelResponse,
} from "@/services/api/workspace/update-revenue-model";
import { ONBOARDING_STATUS_QUERY_KEY } from "./use-get-onboarding-status";

interface UseUpdateRevenueModelOptions {
  defaultValues?: Partial<RevenueModelSchemaType>;
  onSuccess?: () => void;
}

// Step-up gated: the caller must supply a stepUpChallengeId from a completed
// step-up challenge — see docs/endpoints/workspace.md and
// [[flolyt_governance_stepup_reminder]]. That challenge flow isn't built yet.
// Also: changing the revenue model DISCARDS the leakage grid built under the old
// model — a UI wiring this in should confirm before submitting on an existing workspace.
const useUpdateRevenueModel = (options?: UseUpdateRevenueModelOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<RevenueModelSchemaType>({
    resolver: zodResolver(revenueModelSchema),
    mode: "onChange",
    defaultValues: {
      revenueModel: undefined,
      stepUpChallengeId: null,
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<UpdateRevenueModelResponse, Error, UpdateRevenueModelPayload>({
    mutationFn: updateRevenueModel,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Revenue model updated");
        queryClient.invalidateQueries({ queryKey: ONBOARDING_STATUS_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update revenue model");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update revenue model");
    },
  });

  const onSubmit = (values: RevenueModelSchemaType) => {
    mutation.mutate({ ...values, stepUpChallengeId: values.stepUpChallengeId ?? null });
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateRevenueModel;
