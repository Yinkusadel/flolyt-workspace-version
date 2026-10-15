import { useQuery } from "@tanstack/react-query";
import {
  getInboxThread,
  type GetInboxThreadResponse,
} from "@/services/api/inbox/get-inbox-thread";

export const INBOX_THREAD_QUERY_KEY = (threadId: string) => ["inbox-thread", threadId];

export const useGetInboxThread = (threadId: string) =>
  useQuery<GetInboxThreadResponse, Error>({
    queryKey: INBOX_THREAD_QUERY_KEY(threadId),
    queryFn: () => getInboxThread(threadId),
    enabled: !!threadId,
  });
