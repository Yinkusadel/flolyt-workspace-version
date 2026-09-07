import { useQuery } from "@tanstack/react-query";
import {
  getAllPlays,
  type GetAllPlaysParams,
  type GetAllPlaysResponse,
} from "@/services/api/rooms/get-all-plays";

export const ALL_PLAYS_QUERY_KEY = (params?: GetAllPlaysParams) => ["all-plays", params];

export const useGetAllPlays = (params?: GetAllPlaysParams) =>
  useQuery<GetAllPlaysResponse, Error>({
    queryKey: ALL_PLAYS_QUERY_KEY(params),
    queryFn: () => getAllPlays(params),
  });
