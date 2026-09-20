import { useQuery } from "@tanstack/react-query";
import { getInboxSent, type GetInboxSentResponse } from "@/services/api/inbox/get-inbox-sent";

export const INBOX_SENT_QUERY_KEY = ["inbox-sent"];

export const useGetInboxSent = (options?: { enabled?: boolean }) =>
  useQuery<GetInboxSentResponse, Error>({
    queryKey: INBOX_SENT_QUERY_KEY,
    queryFn: getInboxSent,
    enabled: options?.enabled,
  });
