import { useQuery } from "@tanstack/react-query";
import { getAcquireChannels, type GetAcquireChannelsResponse } from "@/services/api/lifecycle/get-acquire-channels";

export const ACQUIRE_CHANNELS_QUERY_KEY = ["lifecycle-acquire-channels"];

export const useGetAcquireChannels = () =>
  useQuery<GetAcquireChannelsResponse, Error>({
    queryKey: ACQUIRE_CHANNELS_QUERY_KEY,
    queryFn: getAcquireChannels,
  });
