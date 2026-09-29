import { useQuery } from "@tanstack/react-query";
import {
  getRoomRuns,
  type GetRoomRunsParams,
  type GetRoomRunsResponse,
} from "@/services/api/rooms/get-room-runs";

export const ROOM_RUNS_QUERY_KEY = (roomId: string, params?: GetRoomRunsParams) => [
  "room-runs",
  roomId,
  params,
];

export const useGetRoomRuns = (roomId: string, params?: GetRoomRunsParams) =>
  useQuery<GetRoomRunsResponse, Error>({
    queryKey: ROOM_RUNS_QUERY_KEY(roomId, params),
    queryFn: () => getRoomRuns(roomId, params),
    enabled: !!roomId,
  });
