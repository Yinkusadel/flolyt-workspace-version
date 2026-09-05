import { useQuery } from "@tanstack/react-query";
import { getRoomViews, type GetRoomViewsResponse } from "@/services/api/rooms/get-room-views";

export const ROOM_VIEWS_QUERY_KEY = ["room-views"];

export const useGetRoomViews = () =>
  useQuery<GetRoomViewsResponse, Error>({
    queryKey: ROOM_VIEWS_QUERY_KEY,
    queryFn: getRoomViews,
  });
