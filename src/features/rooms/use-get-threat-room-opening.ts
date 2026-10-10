import { useQuery } from "@tanstack/react-query";
import {
  getThreatRoomOpening,
  type GetThreatRoomOpeningResponse,
} from "@/services/api/rooms/get-threat-room-opening";

export const GET_THREAT_ROOM_OPENING_QUERY_KEY = (investigationId: string) => ["threat-room-opening", investigationId];

export const useGetThreatRoomOpening = (investigationId: string) =>
  useQuery<GetThreatRoomOpeningResponse, Error>({
    queryKey: GET_THREAT_ROOM_OPENING_QUERY_KEY(investigationId),
    queryFn: () => getThreatRoomOpening(investigationId),
    enabled: !!investigationId,
  });
