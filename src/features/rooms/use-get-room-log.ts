import { useQuery } from "@tanstack/react-query";
import { getRoomLog, type GetRoomLogResponse } from "@/services/api/rooms/get-room-log";

export const ROOM_LOG_QUERY_KEY = (roomId: string) => ["room-log", roomId];

export const useGetRoomLog = (roomId: string) =>
  useQuery<GetRoomLogResponse, Error>({
    queryKey: ROOM_LOG_QUERY_KEY(roomId),
    queryFn: () => getRoomLog(roomId),
    enabled: !!roomId,
  });
