import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  disconnectDatasource,
  type DisconnectDatasourceParams,
  type DisconnectDatasourceResponse,
} from "@/services/api/datasources/disconnect-datasource";
import { CONNECTED_DATASOURCES_QUERY_KEY } from "./use-get-connected-datasources";
import { DATASOURCE_DISCONNECTIONS_QUERY_KEY } from "./use-get-datasource-disconnections";

interface UseDisconnectDatasourceOptions {
  onSuccess?: () => void;
}

const useDisconnectDatasource = (options?: UseDisconnectDatasourceOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DisconnectDatasourceResponse,
    Error,
    DisconnectDatasourceParams
  >({
    mutationFn: disconnectDatasource,
    onSuccess: (data) => {
      if (data.succeeded && data.data) {
        toast.success("Datasource disconnected");
        queryClient.invalidateQueries({ queryKey: CONNECTED_DATASOURCES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: DATASOURCE_DISCONNECTIONS_QUERY_KEY });
        options?.onSuccess?.();
        return;
      }

      toast.error(data.messages?.[0] || "Failed to disconnect datasource");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disconnect datasource");
    },
  });

  return {
    disconnect: mutation.mutate,
    disconnectAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};

export default useDisconnectDatasource;
