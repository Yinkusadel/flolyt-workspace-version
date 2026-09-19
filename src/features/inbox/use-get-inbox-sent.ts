import { useQuery } from "@tanstack/react-query";
import { getInboxSent, type GetInboxSentResponse } from "@/services/api/inbox/get-inbox-sent";

export const INBOX_SENT_QUERY_KEY = ["inbox-sent"];

export const useGetInboxSent = () =>
  useQuery<GetInboxSentResponse, Error>({
    queryKey: INBOX_SENT_QUERY_KEY,
    queryFn: getInboxSent,
  });
