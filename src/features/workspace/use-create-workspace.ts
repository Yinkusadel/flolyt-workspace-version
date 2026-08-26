import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { createWorkspaceSchema, type CreateWorkspaceSchemaType } from "@/validators/workspace";
import {
  createWorkspace,
  type CreateWorkspacePayload,
  type CreateWorkspaceResponse,
} from "@/services/api/workspace/create-workspace";

interface UseCreateWorkspaceOptions {
  onSuccess?: (workspaceId: string) => void;
}

const useCreateWorkspace = (options?: UseCreateWorkspaceOptions) => {
  const form = useForm<CreateWorkspaceSchemaType>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      phoneNumber: null,
      email: "",
      jobRole: "",
      employeeCountRange: "",
      location: "",
      city: "",
      state: "",
      zipCode: null,
      country: "",
      timeZoneId: "",
      currency: "",
      webSite: null,
    },
  });

  const mutation = useMutation<CreateWorkspaceResponse, Error, CreateWorkspacePayload>({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Workspace created");
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to create workspace");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create workspace");
    },
  });

  const onSubmit = (values: CreateWorkspaceSchemaType) => {
    mutation.mutate({
      ...values,
      phoneNumber: values.phoneNumber ?? null,
      zipCode: values.zipCode ?? null,
      webSite: values.webSite ?? null,
    });
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useCreateWorkspace;
