import { useQuery } from "@tanstack/react-query";
import {
  getRoomGuardrails,
  type GetRoomGuardrailsResponse,
} from "@/services/api/rooms/get-room-guardrails";

export const ROOM_GUARDRAILS_QUERY_KEY = (roomId: string) => ["room-guardrails", roomId];

export const useGetRoomGuardrails = (roomId: string) =>
  useQuery<GetRoomGuardrailsResponse, Error>({
    queryKey: ROOM_GUARDRAILS_QUERY_KEY(roomId),
    queryFn: () => getRoomGuardrails(roomId),
    enabled: !!roomId,
  });
