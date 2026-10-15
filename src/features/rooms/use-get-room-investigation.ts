import { useQuery } from "@tanstack/react-query";
import { getRoomInvestigation, type GetRoomInvestigationResponse } from "@/services/api/rooms/get-room-investigation";

export const ROOM_INVESTIGATION_QUERY_KEY = (roomId: string) => ["room-investigation", roomId];

export const useGetRoomInvestigation = (roomId: string) =>
  useQuery<GetRoomInvestigationResponse, Error>({
    queryKey: ROOM_INVESTIGATION_QUERY_KEY(roomId),
    queryFn: () => getRoomInvestigation(roomId),
    enabled: !!roomId,
    retry: false,
  });
