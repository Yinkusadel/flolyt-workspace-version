import { useQuery } from "@tanstack/react-query";
import { getRoom, type GetRoomResponse } from "@/services/api/rooms/get-room";

export const ROOM_QUERY_KEY = (roomId: string) => ["room", roomId];

export const useGetRoom = (roomId: string) =>
  useQuery<GetRoomResponse, Error>({
    queryKey: ROOM_QUERY_KEY(roomId),
    queryFn: () => getRoom(roomId),
    enabled: !!roomId,
  });
