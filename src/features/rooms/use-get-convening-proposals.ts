import { useQuery } from "@tanstack/react-query";
import {
  getConveningProposals,
  type GetConveningProposalsParams,
  type GetConveningProposalsResponse,
} from "@/services/api/rooms/get-convening-proposals";

export const CONVENING_QUERY_KEY = (params?: GetConveningProposalsParams) => [
  "room-convening",
  params,
];

export const useGetConveningProposals = (params?: GetConveningProposalsParams) =>
  useQuery<GetConveningProposalsResponse, Error>({
    queryKey: CONVENING_QUERY_KEY(params),
    queryFn: () => getConveningProposals(params),
  });
