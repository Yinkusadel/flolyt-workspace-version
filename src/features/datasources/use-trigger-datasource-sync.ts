import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  triggerDatasourceSync,
  type TriggerDatasourceSyncResponse,
} from "@/services/api/datasources/trigger-datasource-sync";
import { DATASOURCE_SYNC_STATUS_QUERY_KEY } from "./use-get-datasource-sync-status";
import { CONNECTED_DATASOURCES_QUERY_KEY } from "./use-get-connected-datasources";

const useTriggerDatasourceSync = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TriggerDatasourceSyncResponse, Error, string>({
    mutationFn: triggerDatasourceSync,
    onSuccess: (data, id) => {
      if (data.succeeded) {
        toast.success("Sync triggered");
        queryClient.invalidateQueries({ queryKey: [...DATASOURCE_SYNC_STATUS_QUERY_KEY, id] });
        queryClient.invalidateQueries({ queryKey: CONNECTED_DATASOURCES_QUERY_KEY });
        return;
      }

      toast.error(data.messages?.[0] || "Failed to trigger sync");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to trigger sync");
    },
  });

  return {
    triggerSync: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useTriggerDatasourceSync;
