import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTeamLead, type UpdateTeamLeadPayload, type UpdateTeamLeadResponse } from "@/services/api/lifecycle/update-team-lead";
import { LIFECYCLE_TEAMS_QUERY_KEY } from "@/features/lifecycle/use-get-lifecycle-teams";

interface UseUpdateTeamLeadOptions {
  onSuccess?: () => void;
}

const useUpdateTeamLead = (options?: UseUpdateTeamLeadOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateTeamLeadResponse, Error, UpdateTeamLeadPayload>({
    mutationFn: updateTeamLead,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to update the team lead");
        return;
      }

      toast.success("Team lead updated");
      queryClient.invalidateQueries({ queryKey: LIFECYCLE_TEAMS_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update the team lead");
    },
  });

  return {
    updateTeamLead: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useUpdateTeamLead;
