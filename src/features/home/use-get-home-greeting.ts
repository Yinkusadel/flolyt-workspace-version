import { useQuery } from "@tanstack/react-query";
import {
  getHomeGreeting,
  type GetHomeGreetingResponse,
} from "@/services/api/home/get-home-greeting";

export const HOME_GREETING_QUERY_KEY = ["home-greeting"];

export const useGetHomeGreeting = () =>
  useQuery<GetHomeGreetingResponse, Error>({
    queryKey: HOME_GREETING_QUERY_KEY,
    queryFn: () => getHomeGreeting(),
  });
