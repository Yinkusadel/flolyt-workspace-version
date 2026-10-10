import { useQuery } from "@tanstack/react-query";
import {
  getRoomVerifications,
  type GetRoomVerificationsParams,
  type GetRoomVerificationsResponse,
} from "@/services/api/rooms/get-room-verifications";

export const GET_ROOM_VERIFICATIONS_QUERY_KEY = (roomId: string, params?: GetRoomVerificationsParams) => ["room-verifications", roomId, params];

export const useGetRoomVerifications = (roomId: string, params?: GetRoomVerificationsParams) =>
  useQuery<GetRoomVerificationsResponse, Error>({
    queryKey: GET_ROOM_VERIFICATIONS_QUERY_KEY(roomId, params),
    queryFn: () => getRoomVerifications(roomId, params),
    enabled: !!roomId,
  });
