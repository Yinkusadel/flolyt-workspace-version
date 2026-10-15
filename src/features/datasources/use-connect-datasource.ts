import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  connectDatasource,
  type ConnectDatasourcePayload,
  type ConnectDatasourceResponse,
} from "@/services/api/datasources/connect-datasource";
import { CONNECTED_DATASOURCES_QUERY_KEY } from "./use-get-connected-datasources";

interface UseConnectDatasourceOptions {
  onSuccess?: (connectionId: string) => void;
}

// `configuration` fields come from a dynamic connect-form built against
// GET /datasources/{name}/connection-schema, so there's no useForm here — the caller
// owns the form and passes the assembled payload straight to `mutate`.
const useConnectDatasource = (options?: UseConnectDatasourceOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ConnectDatasourceResponse, Error, ConnectDatasourcePayload>({
    mutationFn: connectDatasource,
    onSuccess: (data) => {
      if (data.succeeded) {
        toast.success("Datasource connected");
        queryClient.invalidateQueries({ queryKey: CONNECTED_DATASOURCES_QUERY_KEY });
        options?.onSuccess?.(data.data);
        return;
      }

      toast.error(data.messages?.[0] || "Failed to connect datasource");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to connect datasource");
    },
  });

  return {
    connect: mutation.mutate,
    connectAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};

export default useConnectDatasource;
