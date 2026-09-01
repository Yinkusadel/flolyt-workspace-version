import { useQuery } from "@tanstack/react-query";
import {
  getRoomPlays,
  type GetRoomPlaysParams,
  type GetRoomPlaysResponse,
} from "@/services/api/rooms/get-room-plays";

export const ROOM_PLAYS_QUERY_KEY = (roomId: string, params?: GetRoomPlaysParams) => [
  "room-plays",
  roomId,
  params,
];

export const useGetRoomPlays = (roomId: string, params?: GetRoomPlaysParams) =>
  useQuery<GetRoomPlaysResponse, Error>({
    queryKey: ROOM_PLAYS_QUERY_KEY(roomId, params),
    queryFn: () => getRoomPlays(roomId, params),
    enabled: !!roomId,
  });
