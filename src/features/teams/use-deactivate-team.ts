import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deactivateTeam,
  type DeactivateTeamResponse,
} from "@/services/api/teams/deactivate-team";
import { TEAMS_QUERY_KEY } from "./use-get-teams";
import { TEAM_DETAIL_QUERY_KEY } from "./use-get-team-by-id";

interface UseDeactivateTeamOptions {
  onSuccess?: () => void;
}

const useDeactivateTeam = (options?: UseDeactivateTeamOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeactivateTeamResponse, Error, string>({
    mutationFn: deactivateTeam,
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Team deactivated");
        queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to deactivate team");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate team");
    },
  });

  return {
    deactivateTeam: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeactivateTeam;
