import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  analyzeWorkspace,
  type AnalyzeWorkspaceResponse,
} from "@/services/api/workspace/analyze-workspace";
import type { WorkspaceProfileDto } from "@/services/api/workspace/get-workspace-profile";
import { WORKSPACE_PROFILE_QUERY_KEY } from "./use-get-workspace-profile";
import { PROPOSED_MARKETS_QUERY_KEY } from "./use-get-proposed-markets";

interface UseAnalyzeWorkspaceOptions {
  onSuccess?: (profile: WorkspaceProfileDto) => void;
}

// Takes no arguments — always analyzes the CALLER'S OWN workspace.
const useAnalyzeWorkspace = (options?: UseAnalyzeWorkspaceOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AnalyzeWorkspaceResponse, Error, void>({
    mutationFn: analyzeWorkspace,
    onSuccess: (data) => {
      if (data.succeeded) {
        // The stored profile is what proposed-markets reads to suggest markets.
        queryClient.invalidateQueries({ queryKey: WORKSPACE_PROFILE_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: PROPOSED_MARKETS_QUERY_KEY });
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to analyze workspace website");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to analyze workspace website");
    },
  });

  return {
    analyze: () => mutation.mutate(),
    isPending: mutation.isPending,
    profile: mutation.data?.data ?? null,
  };
};

export default useAnalyzeWorkspace;
