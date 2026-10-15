import { useQuery } from "@tanstack/react-query";
import {
  getRoomDecision,
  type GetRoomDecisionResponse,
} from "@/services/api/rooms/get-room-decision";

export const ROOM_DECISION_QUERY_KEY = (roomId: string) => ["room-decision", roomId];

export const useGetRoomDecision = (roomId: string) =>
  useQuery<GetRoomDecisionResponse, Error>({
    queryKey: ROOM_DECISION_QUERY_KEY(roomId),
    queryFn: () => getRoomDecision(roomId),
    enabled: !!roomId,
  });
