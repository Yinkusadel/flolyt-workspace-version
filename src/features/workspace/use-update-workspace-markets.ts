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
import { PROPOSED_MARKETS_QUERY_KEY } from "./use-get-proposed-markets";
import { ONBOARDING_STATUS_QUERY_KEY } from "./use-get-onboarding-status";

interface UseUpdateWorkspaceMarketsOptions {
  defaultValues?: Partial<WorkspaceMarketsSchemaType>;
  onSuccess?: () => void;
}

// Step-up gated: the caller must supply a stepUpChallengeId from a completed
// step-up challenge — see docs/endpoints/workspace.md and
// [[flolyt_governance_stepup_reminder]]. That challenge flow isn't built yet.
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
        toast.success("Markets updated");
        queryClient.invalidateQueries({ queryKey: PROPOSED_MARKETS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ONBOARDING_STATUS_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update markets");
    },
    onError: (error) => {
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
