import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workspaceIdentitySchema, type WorkspaceIdentitySchemaType } from "@/validators/workspace";
import {
  updateWorkspaceIdentity,
  type UpdateWorkspaceIdentityPayload,
  type UpdateWorkspaceIdentityResponse,
} from "@/services/api/workspace/update-workspace-identity";
import { ONBOARDING_STATUS_QUERY_KEY } from "./use-get-onboarding-status";

interface UseUpdateWorkspaceIdentityOptions {
  defaultValues?: Partial<WorkspaceIdentitySchemaType>;
  onSuccess?: () => void;
}

const useUpdateWorkspaceIdentity = (options?: UseUpdateWorkspaceIdentityOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<WorkspaceIdentitySchemaType>({
    resolver: zodResolver(workspaceIdentitySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      timeZoneId: "",
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<
    UpdateWorkspaceIdentityResponse,
    Error,
    UpdateWorkspaceIdentityPayload
  >({
    mutationFn: updateWorkspaceIdentity,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Workspace identity saved");
        queryClient.invalidateQueries({ queryKey: ONBOARDING_STATUS_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to save workspace identity");
    },
    onError: (error) => {
      // The slug is accepted once — a second call with a different address is
      // refused, so a 400 here is very likely "that address is already claimed".
      toast.error(error.message || "Failed to save workspace identity");
    },
  });

  const onSubmit = (values: WorkspaceIdentitySchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateWorkspaceIdentity;
