import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workspaceProfileSchema, type WorkspaceProfileSchemaType } from "@/validators/workspace";
import {
  updateWorkspaceProfile,
  type UpdateWorkspaceProfilePayload,
  type UpdateWorkspaceProfileResponse,
} from "@/services/api/workspace/update-workspace-profile";
import { WORKSPACE_PROFILE_QUERY_KEY } from "./use-get-workspace-profile";

interface UseUpdateWorkspaceProfileOptions {
  defaultValues?: Partial<WorkspaceProfileSchemaType>;
  onSuccess?: () => void;
}

const useUpdateWorkspaceProfile = (options?: UseUpdateWorkspaceProfileOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<WorkspaceProfileSchemaType>({
    resolver: zodResolver(workspaceProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<
    UpdateWorkspaceProfileResponse,
    Error,
    UpdateWorkspaceProfilePayload
  >({
    mutationFn: updateWorkspaceProfile,
    onSuccess: (data) => {
      if (data.data) {
        toast.success("Workspace profile updated");
        queryClient.invalidateQueries({ queryKey: WORKSPACE_PROFILE_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update workspace profile");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workspace profile");
    },
  });

  const onSubmit = (values: WorkspaceProfileSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateWorkspaceProfile;
