import { useQuery } from "@tanstack/react-query";
import { getInboxDrafts, type GetInboxDraftsResponse } from "@/services/api/inbox/get-inbox-drafts";

export const INBOX_DRAFTS_QUERY_KEY = ["inbox-drafts"];

export const useGetInboxDrafts = () =>
  useQuery<GetInboxDraftsResponse, Error>({
    queryKey: INBOX_DRAFTS_QUERY_KEY,
    queryFn: getInboxDrafts,
  });
