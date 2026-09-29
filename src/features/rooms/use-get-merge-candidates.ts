import { useQuery } from "@tanstack/react-query";
import {
  getMergeCandidates,
  type GetMergeCandidatesResponse,
} from "@/services/api/rooms/get-merge-candidates";

export const MERGE_CANDIDATES_QUERY_KEY = (roomId: string) => ["room-merge-candidates", roomId];

export const useGetMergeCandidates = (roomId: string) =>
  useQuery<GetMergeCandidatesResponse, Error>({
    queryKey: MERGE_CANDIDATES_QUERY_KEY(roomId),
    queryFn: () => getMergeCandidates(roomId),
    enabled: !!roomId,
  });
