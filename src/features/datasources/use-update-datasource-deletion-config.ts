import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateDatasourceDeletionConfigSchema,
  type UpdateDatasourceDeletionConfigSchemaType,
} from "@/validators/datasources";
import {
  updateDatasourceDeletionConfig,
  type UpdateDatasourceDeletionConfigPayload,
  type UpdateDatasourceDeletionConfigResponse,
} from "@/services/api/datasources/update-datasource-deletion-config";
import { DATASOURCE_DELETION_CONFIG_QUERY_KEY } from "./use-get-datasource-deletion-config";

interface UseUpdateDatasourceDeletionConfigOptions {
  defaultValues?: Partial<UpdateDatasourceDeletionConfigSchemaType>;
  onSuccess?: () => void;
}

const useUpdateDatasourceDeletionConfig = (
  options?: UseUpdateDatasourceDeletionConfigOptions
) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateDatasourceDeletionConfigSchemaType>({
    resolver: zodResolver(updateDatasourceDeletionConfigSchema),
    mode: "onChange",
    defaultValues: {
      deletionBatchSize: null,
      warnCustomersDeletableThreshold: null,
      ...options?.defaultValues,
    },
  });

  const mutation = useMutation<
    UpdateDatasourceDeletionConfigResponse,
    Error,
    UpdateDatasourceDeletionConfigPayload
  >({
    mutationFn: updateDatasourceDeletionConfig,
    onSuccess: (data) => {
      if (data.succeeded && data.data) {
        toast.success("Deletion settings updated");
        queryClient.invalidateQueries({ queryKey: DATASOURCE_DELETION_CONFIG_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to update deletion settings");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update deletion settings");
    },
  });

  const onSubmit = (values: UpdateDatasourceDeletionConfigSchemaType) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};

export default useUpdateDatasourceDeletionConfig;
