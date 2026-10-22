import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createVerificationPlan,
  type CreateVerificationPlanPayload,
  type CreateVerificationPlanResponse,
} from "@/services/api/rooms/create-verification-plan";

interface UseCreateVerificationPlanOptions {
  onSuccess?: (data: unknown) => void;
}

const useCreateVerificationPlan = (options?: UseCreateVerificationPlanOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateVerificationPlanResponse, Error, CreateVerificationPlanPayload>({
    mutationFn: createVerificationPlan,
    onSuccess: (data, variables) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to register the verification plan");
        return;
      }

      toast.success("Verification plan registered");
      queryClient.invalidateQueries({ queryKey: ["room-verifications", variables.roomId] });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register the verification plan");
    },
  });

  return {
    createVerificationPlan: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateVerificationPlan;
