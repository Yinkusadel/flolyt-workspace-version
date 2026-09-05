import { useQuery } from "@tanstack/react-query";
import { getRooms, type GetRoomsParams, type GetRoomsResponse } from "@/services/api/rooms/get-rooms";

export const ROOMS_QUERY_KEY = (params?: GetRoomsParams) => ["rooms", params];

export const useGetRooms = (params?: GetRoomsParams) =>
  useQuery<GetRoomsResponse, Error>({
    queryKey: ROOMS_QUERY_KEY(params),
    queryFn: () => getRooms(params),
  });
