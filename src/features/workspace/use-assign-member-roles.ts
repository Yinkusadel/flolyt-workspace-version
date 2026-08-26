import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assignMemberRolesSchema, type AssignMemberRolesSchemaType } from "@/validators/workspace";
import {
  assignMemberRoles,
  type AssignMemberRolesPayload,
  type AssignMemberRolesResponse,
} from "@/services/api/workspace/assign-member-roles";
import { WORKSPACE_MEMBERS_QUERY_KEY } from "./use-get-workspace-members";
import { MY_ROLES_QUERY_KEY } from "./use-get-my-roles";
import { MEMBER_ROLES_QUERY_KEY } from "./use-get-member-roles";

interface UseAssignMemberRolesOptions {
  defaultValues?: Partial<AssignMemberRolesSchemaType>;
  onSuccess?: () => void;
}

// Admin-only.
const useAssignMemberRoles = (options?: UseAssignMemberRolesOptions) => {
  const queryClient = useQueryClient();

  const form = useForm<AssignMemberRolesSchemaType>({
    resolver: zodResolver(assignMemberRolesSchema),
    mode: "onChange",
    defaultValues: {
      userId: "",
      functionalRoles: [],
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<AssignMemberRolesResponse, Error, AssignMemberRolesPayload>({
    mutationFn: assignMemberRoles,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Roles assigned");
        queryClient.invalidateQueries({ queryKey: WORKSPACE_MEMBERS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: MY_ROLES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: MEMBER_ROLES_QUERY_KEY });
        form.reset();
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to assign roles");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign roles");
    },
  });

  const onSubmit = (values: AssignMemberRolesSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    assignRoles: mutation.mutate,
  };
};

export default useAssignMemberRoles;
