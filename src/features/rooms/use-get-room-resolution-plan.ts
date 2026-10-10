import { useQuery } from "@tanstack/react-query";
import {
  getRoomResolutionPlan,
  type GetRoomResolutionPlanResponse,
} from "@/services/api/rooms/get-room-resolution-plan";

export const GET_ROOM_RESOLUTION_PLAN_QUERY_KEY = (roomId: string) => ["room-resolution-plan", roomId];

export const useGetRoomResolutionPlan = (roomId: string) =>
  useQuery<GetRoomResolutionPlanResponse, Error>({
    queryKey: GET_ROOM_RESOLUTION_PLAN_QUERY_KEY(roomId),
    queryFn: () => getRoomResolutionPlan(roomId),
    enabled: !!roomId,
  });
