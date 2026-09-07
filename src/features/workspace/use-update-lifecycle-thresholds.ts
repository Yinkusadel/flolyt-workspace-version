import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  lifecycleThresholdsSchema,
  type LifecycleThresholdsSchemaType,
} from "@/validators/workspace";
import {
  updateLifecycleThresholds,
  type UpdateLifecycleThresholdsPayload,
  type UpdateLifecycleThresholdsResponse,
} from "@/services/api/workspace/update-lifecycle-thresholds";
import { LIFECYCLE_THRESHOLDS_QUERY_KEY } from "./use-get-lifecycle-thresholds";

interface UseUpdateLifecycleThresholdsOptions {
  defaultValues?: Partial<LifecycleThresholdsSchemaType>;
  onSuccess?: () => void;
}

// Changing any of these reclassifies the whole customer base on next refresh — a
// UI wiring this in should warn before submitting on a workspace that already has data.
const useUpdateLifecycleThresholds = (options?: UseUpdateLifecycleThresholdsOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<LifecycleThresholdsSchemaType>({
    resolver: zodResolver(lifecycleThresholdsSchema),
    mode: "onChange",
    defaultValues: {
      activeWithinDays: undefined,
      slippingWithinDays: undefined,
      reactivationDormantDays: null,
      repeatCustomerOrders: null,
      repeatCustomerWindowDays: null,
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<
    UpdateLifecycleThresholdsResponse,
    Error,
    UpdateLifecycleThresholdsPayload
  >({
    mutationFn: updateLifecycleThresholds,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Lifecycle thresholds updated");
        queryClient.invalidateQueries({ queryKey: LIFECYCLE_THRESHOLDS_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update lifecycle thresholds");
    },
    onError: (error) => {
      // The server refuses when the lapsed boundary doesn't exceed the active window,
      // when reactivation dormancy doesn't exceed it, or when repeat orders < 2 — the
      // zod schema mirrors these, but the server message still wins if it differs.
      toast.error(error.message || "Failed to update lifecycle thresholds");
    },
  });

  const onSubmit = (values: LifecycleThresholdsSchemaType) => {
    mutation.mutate({
      activeWithinDays: values.activeWithinDays,
      slippingWithinDays: values.slippingWithinDays,
      reactivationDormantDays: values.reactivationDormantDays ?? null,
      repeatCustomerOrders: values.repeatCustomerOrders ?? null,
      repeatCustomerWindowDays: values.repeatCustomerWindowDays ?? null,
    });
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateLifecycleThresholds;
