import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeamSchema, type CreateTeamSchemaType } from "@/validators/teams";
import {
  createTeam,
  type CreateTeamPayload,
  type CreateTeamResponse,
} from "@/services/api/teams/create-team";
import { TEAMS_QUERY_KEY } from "./use-get-teams";

interface UseCreateTeamOptions {
  onSuccess?: (teamId: string) => void;
}

const useCreateTeam = (options?: UseCreateTeamOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateTeamSchemaType>({
    resolver: zodResolver(createTeamSchema),
    mode: "onChange",
    defaultValues: { name: "", description: null },
  });

  const mutation = useMutation<CreateTeamResponse, Error, CreateTeamPayload>({
    mutationFn: createTeam,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Team created");
        queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
        form.reset();
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to create team");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create team");
    },
  });

  const onSubmit = (values: CreateTeamSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useCreateTeam;
