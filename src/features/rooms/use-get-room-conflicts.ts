import { useQuery } from "@tanstack/react-query";
import {
  getRoomConflicts,
  type GetRoomConflictsParams,
  type GetRoomConflictsResponse,
} from "@/services/api/rooms/get-room-conflicts";

export const ROOM_CONFLICTS_QUERY_KEY = (roomId: string, params?: GetRoomConflictsParams) => [
  "room-conflicts",
  roomId,
  params,
];

export const useGetRoomConflicts = (roomId: string, params?: GetRoomConflictsParams) =>
  useQuery<GetRoomConflictsResponse, Error>({
    queryKey: ROOM_CONFLICTS_QUERY_KEY(roomId, params),
    queryFn: () => getRoomConflicts(roomId, params),
    enabled: !!roomId,
  });
