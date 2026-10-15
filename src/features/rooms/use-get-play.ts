import { useQuery } from "@tanstack/react-query";
import { getPlay, type GetPlayResponse } from "@/services/api/rooms/get-play";

export const PLAY_QUERY_KEY = (proposalId: string) => ["play", proposalId];

export const useGetPlay = (proposalId: string) =>
  useQuery<GetPlayResponse, Error>({
    queryKey: PLAY_QUERY_KEY(proposalId),
    queryFn: () => getPlay(proposalId),
    enabled: !!proposalId,
  });
