import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  reconnectDatasource,
  type ReconnectDatasourceResponse,
} from "@/services/api/datasources/reconnect-datasource";
import { CONNECTED_DATASOURCES_QUERY_KEY } from "./use-get-connected-datasources";

const useReconnectDatasource = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReconnectDatasourceResponse, Error, string>({
    mutationFn: reconnectDatasource,
    onSuccess: (data) => {
      if (data.succeeded && data.data) {
        toast.success("Datasource reconnected");
        queryClient.invalidateQueries({ queryKey: CONNECTED_DATASOURCES_QUERY_KEY });
        return;
      }

      toast.error(data.messages?.[0] || "Failed to reconnect datasource");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reconnect datasource");
    },
  });

  return {
    reconnect: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useReconnectDatasource;
