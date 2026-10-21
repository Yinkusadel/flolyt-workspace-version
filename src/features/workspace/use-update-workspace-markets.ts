import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workspaceMarketsSchema, type WorkspaceMarketsSchemaType } from "@/validators/workspace";
import {
  updateWorkspaceMarkets,
  type UpdateWorkspaceMarketsPayload,
  type UpdateWorkspaceMarketsResponse,
} from "@/services/api/workspace/update-workspace-markets";
import { isStepUpRequiredMessage } from "@/features/auth/use-step-up-confirmation";
import { PROPOSED_MARKETS_QUERY_KEY } from "./use-get-proposed-markets";
import { ONBOARDING_STATUS_QUERY_KEY } from "./use-get-onboarding-status";

interface UseUpdateWorkspaceMarketsOptions {
  defaultValues?: Partial<WorkspaceMarketsSchemaType>;
  onSuccess?: () => void;
  /** Fires when the server asks for the emailed code; the caller should run step-up and resubmit. */
  onStepUpRequired?: () => void;
}

// Step-up is conditional (auth-and-lifecycle-frontend-handoff.md): the first declaration, initial
// setup corrections and unchanged retries need no code. Submit bare; if the server answers with the
// confirmation message, onStepUpRequired lets the caller request a code and resubmit with the id.
const useUpdateWorkspaceMarkets = (options?: UseUpdateWorkspaceMarketsOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<WorkspaceMarketsSchemaType>({
    resolver: zodResolver(workspaceMarketsSchema),
    mode: "onChange",
    defaultValues: {
      markets: [],
      primaryMarketCountry: "",
      reportingCurrency: null,
      stepUpChallengeId: null,
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<
    UpdateWorkspaceMarketsResponse,
    Error,
    UpdateWorkspaceMarketsPayload
  >({
    mutationFn: updateWorkspaceMarkets,
    onSuccess: (data) => {
      if (data.succeeded) {
        queryClient.invalidateQueries({ queryKey: PROPOSED_MARKETS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ONBOARDING_STATUS_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      if (isStepUpRequiredMessage(data.messages?.[0])) {
        options?.onStepUpRequired?.();
        return;
      }
      toast.error(data.messages?.[0] || "Failed to update markets");
    },
    onError: (error) => {
      if (isStepUpRequiredMessage(error.message)) {
        options?.onStepUpRequired?.();
        return;
      }
      toast.error(error.message || "Failed to update markets");
    },
  });

  const onSubmit = (values: WorkspaceMarketsSchemaType) => {
    mutation.mutate({
      ...values,
      reportingCurrency: values.reportingCurrency ?? null,
      stepUpChallengeId: values.stepUpChallengeId ?? null,
    });
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateWorkspaceMarkets;
