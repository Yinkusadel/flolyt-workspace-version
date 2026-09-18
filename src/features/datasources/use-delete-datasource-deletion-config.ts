import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteDatasourceDeletionConfig,
  type DeleteDatasourceDeletionConfigResponse,
} from "@/services/api/datasources/delete-datasource-deletion-config";
import { DATASOURCE_DELETION_CONFIG_QUERY_KEY } from "./use-get-datasource-deletion-config";

const useDeleteDatasourceDeletionConfig = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteDatasourceDeletionConfigResponse, Error, void>({
    mutationFn: deleteDatasourceDeletionConfig,
    onSuccess: (data) => {
      if (data.succeeded && data.data) {
        toast.success("Reverted to global defaults");
        queryClient.invalidateQueries({ queryKey: DATASOURCE_DELETION_CONFIG_QUERY_KEY });
        return;
      }

      toast.error(data.messages?.[0] || "Failed to revert deletion settings");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revert deletion settings");
    },
  });

  return {
    resetToDefaults: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useDeleteDatasourceDeletionConfig;
