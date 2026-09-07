import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  routeChurnUpstream,
  type RouteChurnUpstreamPayload,
  type RouteChurnUpstreamResponse,
} from "@/services/api/lifecycle/route-churn-upstream";
import { CHURN_ROUTINGS_QUERY_KEY } from "@/features/lifecycle/use-get-churn-routings";

interface UseRouteChurnUpstreamOptions {
  onSuccess?: (routingId: string) => void;
}

const useRouteChurnUpstream = (options?: UseRouteChurnUpstreamOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RouteChurnUpstreamResponse, Error, RouteChurnUpstreamPayload>({
    mutationFn: routeChurnUpstream,
    onSuccess: (data) => {
      if (!data.succeeded) {
        toast.error(data.messages?.[0] || "Failed to route the churn cause upstream");
        return;
      }

      toast.success("Cause routed upstream");
      queryClient.invalidateQueries({ queryKey: CHURN_ROUTINGS_QUERY_KEY() });
      options?.onSuccess?.(data.data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to route the churn cause upstream");
    },
  });

  return {
    routeUpstream: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useRouteChurnUpstream;
