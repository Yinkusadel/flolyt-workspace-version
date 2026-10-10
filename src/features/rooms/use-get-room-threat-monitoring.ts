import { useQuery } from "@tanstack/react-query";
import {
  getRoomThreatMonitoring,
  type GetRoomThreatMonitoringResponse,
} from "@/services/api/rooms/get-room-threat-monitoring";

export const GET_ROOM_THREAT_MONITORING_QUERY_KEY = (roomId: string) => ["room-threat-monitoring", roomId];

export const useGetRoomThreatMonitoring = (roomId: string) =>
  useQuery<GetRoomThreatMonitoringResponse, Error>({
    queryKey: GET_ROOM_THREAT_MONITORING_QUERY_KEY(roomId),
    queryFn: () => getRoomThreatMonitoring(roomId),
    enabled: !!roomId,
    // No push channel this phase: poll while viewing so background updates surface.
    refetchInterval: 60_000,
  });
