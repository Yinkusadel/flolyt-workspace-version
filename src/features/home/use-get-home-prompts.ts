import { useQuery } from "@tanstack/react-query";
import {
  getHomePrompts,
  type GetHomePromptsResponse,
} from "@/services/api/home/get-home-prompts";

export const HOME_PROMPTS_QUERY_KEY = ["home-prompts"];

export const useGetHomePrompts = () =>
  useQuery<GetHomePromptsResponse, Error>({
    queryKey: HOME_PROMPTS_QUERY_KEY,
    queryFn: () => getHomePrompts(),
  });
