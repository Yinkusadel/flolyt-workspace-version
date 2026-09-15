import { useQuery } from "@tanstack/react-query";
import {
  getRoomSubscriptions,
  type GetRoomSubscriptionsParams,
  type GetRoomSubscriptionsResponse,
} from "@/services/api/rooms/get-room-subscriptions";

export const ROOM_SUBSCRIPTIONS_QUERY_KEY = (params?: GetRoomSubscriptionsParams) => [
  "room-subscriptions",
  params,
];

export const useGetRoomSubscriptions = (params?: GetRoomSubscriptionsParams) =>
  useQuery<GetRoomSubscriptionsResponse, Error>({
    queryKey: ROOM_SUBSCRIPTIONS_QUERY_KEY(params),
    queryFn: () => getRoomSubscriptions(params),
  });
