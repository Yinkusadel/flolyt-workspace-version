import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTeamSchema, type UpdateTeamSchemaType } from "@/validators/teams";
import {
  updateTeam,
  type UpdateTeamResponse,
} from "@/services/api/teams/update-team";
import { TEAMS_QUERY_KEY } from "./use-get-teams";
import { TEAM_DETAIL_QUERY_KEY } from "./use-get-team-by-id";

interface UseUpdateTeamOptions {
  defaultValues?: Partial<UpdateTeamSchemaType>;
  onSuccess?: () => void;
}

const useUpdateTeam = (teamId: string, options?: UseUpdateTeamOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateTeamSchemaType>({
    resolver: zodResolver(updateTeamSchema),
    mode: "onChange",
    defaultValues: { name: "", description: null, ...options?.defaultValues },
  });

  const mutation = useMutation<UpdateTeamResponse, Error, UpdateTeamSchemaType>({
    mutationFn: (payload) => updateTeam(teamId, payload),
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Team updated");
        queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update team");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update team");
    },
  });

  const onSubmit = (values: UpdateTeamSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateTeam;
