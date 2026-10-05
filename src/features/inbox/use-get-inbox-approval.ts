import { useQuery } from "@tanstack/react-query";
import {
  getInboxApproval,
  type GetInboxApprovalResponse,
} from "@/services/api/inbox/get-inbox-approval";

export const INBOX_APPROVAL_QUERY_KEY = (proposalId: string) => ["inbox-approval", proposalId];

export const useGetInboxApproval = (proposalId: string) =>
  useQuery<GetInboxApprovalResponse, Error>({
    queryKey: INBOX_APPROVAL_QUERY_KEY(proposalId),
    queryFn: () => getInboxApproval(proposalId),
    enabled: !!proposalId,
  });
