import { useQuery } from "@tanstack/react-query";
import { getRoomPeople, type GetRoomPeopleResponse } from "@/services/api/rooms/get-room-people";

export const ROOM_PEOPLE_QUERY_KEY = (roomId: string) => ["room-people", roomId];

export const useGetRoomPeople = (roomId: string) =>
  useQuery<GetRoomPeopleResponse, Error>({
    queryKey: ROOM_PEOPLE_QUERY_KEY(roomId),
    queryFn: () => getRoomPeople(roomId),
    enabled: !!roomId,
  });
