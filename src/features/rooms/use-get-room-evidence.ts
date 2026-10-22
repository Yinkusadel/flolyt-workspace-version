import { useQuery } from "@tanstack/react-query";
import { getRoomEvidence, type GetRoomEvidenceResponse } from "@/services/api/rooms/get-room-evidence";

export const ROOM_EVIDENCE_QUERY_KEY = (roomId: string) => ["room-evidence", roomId];

export const useGetRoomEvidence = (roomId: string) =>
  useQuery<GetRoomEvidenceResponse, Error>({
    queryKey: ROOM_EVIDENCE_QUERY_KEY(roomId),
    queryFn: () => getRoomEvidence(roomId),
    enabled: !!roomId,
  });
