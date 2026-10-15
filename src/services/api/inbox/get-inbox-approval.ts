import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface InboxApprovalFraming {
  summary: string;
  reach: number;
  effect: number | null;
  currency: string | null;
  plannedSendAtUtc: string | null;
  audienceSegmentId: string | null;
  fingerprint: string | null;
}

export interface InboxApprovalRoom {
  id: string;
  title: string;
  status: string;
  stageLabel: string;
  conditionLabel: string;
  currency: string;
  amountAtRisk: number;
  population: number;
  ownerMemberId: string;
}

export interface InboxApprovalEvidence {
  claimId: string;
  statement: string;
  badge: string;
  source: string;
  window: string;
  n: number | null;
  gaps: string[];
}

export interface InboxApprovalDissent {
  wording: string;
  by: string;
  recordedAtUtc: string;
  borneOut: boolean | null;
}

export interface InboxApprovalDetailDto {
  proposalId: string;
  toolName: string;
  state: string;
  isPending: boolean;
  rationale: string | null;
  effectiveArgumentsJson: string;
  wasEdited: boolean;
  proposedBy: string | null;
  figuresAreStated: boolean;
  reachesCustomers: boolean;
  framing: InboxApprovalFraming;
  decisionOwnerMemberId: string;
  createdAtUtc: string;
  waitingFor: string | null;
  room: InboxApprovalRoom | null;
  evidenceCount: number;
  evidence: InboxApprovalEvidence[];
  dissent: InboxApprovalDissent[];
}

export interface GetInboxApprovalResponse {
  data: InboxApprovalDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { GET_INBOX_APPROVAL },
} = API_ENDPOINTS;

// Findings graded insufficient-evidence are absent from `evidence`, not badged — the room's
// evidence tab carries those instead. A proposal raised outside any room comes back with
// room/evidence/dissent all empty rather than failing.
export const getInboxApproval = async (proposalId: string): Promise<GetInboxApprovalResponse> => {
  try {
    const response = await axiosInstance.get<GetInboxApprovalResponse>(
      GET_INBOX_APPROVAL.replace("{proposalId}", proposalId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the approval");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
