import { useQuery } from "@tanstack/react-query";
import {
  getCitedDissent,
  type GetCitedDissentParams,
  type GetCitedDissentResponse,
} from "@/services/api/rooms/get-cited-dissent";

export const CITED_DISSENT_QUERY_KEY = (roomId: string, params: GetCitedDissentParams) => [
  "room-cited-dissent",
  roomId,
  params,
];

export const useGetCitedDissent = (roomId: string, params: GetCitedDissentParams) =>
  useQuery<GetCitedDissentResponse, Error>({
    queryKey: CITED_DISSENT_QUERY_KEY(roomId, params),
    queryFn: () => getCitedDissent(roomId, params),
    enabled: !!roomId && !!params?.proposalId,
  });
