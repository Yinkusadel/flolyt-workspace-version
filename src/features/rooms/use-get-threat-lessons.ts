import { useQuery } from "@tanstack/react-query";
import {
  getThreatLessons,
  type GetThreatLessonsParams,
  type GetThreatLessonsResponse,
} from "@/services/api/rooms/get-threat-lessons";

export const GET_THREAT_LESSONS_QUERY_KEY = (params?: GetThreatLessonsParams) => ["threat-lessons", params];

export const useGetThreatLessons = (params?: GetThreatLessonsParams) =>
  useQuery<GetThreatLessonsResponse, Error>({
    queryKey: GET_THREAT_LESSONS_QUERY_KEY(params),
    queryFn: () => getThreatLessons(params),
  });
