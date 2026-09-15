import { useQuery } from "@tanstack/react-query";
import {
  getAllDissent,
  type GetAllDissentParams,
  type GetAllDissentResponse,
} from "@/services/api/rooms/get-all-dissent";

export const ALL_DISSENT_QUERY_KEY = (params?: GetAllDissentParams) => [
  "room-dissent-all",
  params,
];

export const useGetAllDissent = (params?: GetAllDissentParams) =>
  useQuery<GetAllDissentResponse, Error>({
    queryKey: ALL_DISSENT_QUERY_KEY(params),
    queryFn: () => getAllDissent(params),
  });
