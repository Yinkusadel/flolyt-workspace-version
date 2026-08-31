import { useQuery } from "@tanstack/react-query";
import { getChangeImpact, type GetChangeImpactResponse } from "@/services/api/lifecycle/get-change-impact";

export const CHANGE_IMPACT_QUERY_KEY = (changeId: string) => ["lifecycle-change-impact", changeId];

export const useGetChangeImpact = (changeId: string) =>
  useQuery<GetChangeImpactResponse, Error>({
    queryKey: CHANGE_IMPACT_QUERY_KEY(changeId),
    queryFn: () => getChangeImpact(changeId),
    enabled: !!changeId,
  });
