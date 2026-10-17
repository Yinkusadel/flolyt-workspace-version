import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
    // Switching "Include decided" asks for a different list: keep showing the current one (dimmed by the page) until it arrives,
    // instead of dropping back to the loading skeleton and rebuilding the whole tab, checkbox included.
    placeholderData: keepPreviousData,
  });
