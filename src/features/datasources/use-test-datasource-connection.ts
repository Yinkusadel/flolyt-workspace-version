import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  testDatasourceConnection,
  type TestDatasourceConnectionPayload,
  type TestDatasourceConnectionResponse,
} from "@/services/api/datasources/test-datasource-connection";

// `configuration` fields come from a dynamic connect-form built against
// GET /datasources/{name}/connection-schema, so there's no useForm here — the caller
// owns the form and passes the assembled payload straight to `mutate`.
const useTestDatasourceConnection = () => {
  const mutation = useMutation<
    TestDatasourceConnectionResponse,
    Error,
    TestDatasourceConnectionPayload
  >({
    mutationFn: testDatasourceConnection,
    onSuccess: (data) => {
      if (data.succeeded && data.data.isSuccessful) return;

      toast.error(data.data.errorMessage || data.messages?.[0] || "Connection test failed");
    },
    onError: (error) => {
      toast.error(error.message || "Connection test failed");
    },
  });

  return {
    testConnection: mutation.mutate,
    testConnectionAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    result: mutation.data?.data ?? null,
  };
};

export default useTestDatasourceConnection;
