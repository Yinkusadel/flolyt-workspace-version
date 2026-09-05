import { useQuery } from "@tanstack/react-query";
import { getRoomCohort, type GetRoomCohortResponse } from "@/services/api/rooms/get-room-cohort";

export const ROOM_COHORT_QUERY_KEY = (roomId: string) => ["room-cohort", roomId];

export const useGetRoomCohort = (roomId: string) =>
  useQuery<GetRoomCohortResponse, Error>({
    queryKey: ROOM_COHORT_QUERY_KEY(roomId),
    queryFn: () => getRoomCohort(roomId),
    enabled: !!roomId,
  });
