import { useQuery } from "@tanstack/react-query";
import { getInbox, type GetInboxParams, type GetInboxResponse } from "@/services/api/inbox/get-inbox";

export const INBOX_QUERY_KEY = (params?: GetInboxParams) => ["inbox", params];

export const useGetInbox = (params?: GetInboxParams) =>
  useQuery<GetInboxResponse, Error>({
    queryKey: INBOX_QUERY_KEY(params),
    queryFn: () => getInbox(params),
  });
