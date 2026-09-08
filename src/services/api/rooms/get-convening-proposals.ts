import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetConveningProposalsParams {
  includeDecided?: boolean;
}

export interface ConveningProposalDto {
  id: string;
  alertCategory: string;
  alertSeverity: string;
  title: string;
  description: string;
  conditionKey: string;
  rowLabel: string;
  currency: string;
  amountAtRisk: number | null;
  customerCount: number | null;
  ownerUserId: string | null;
  outcome: string;
  roomId: string | null;
  raisedAtUtc: string;
}

export interface ConveningWithheldDto {
  id: string;
  alertCategory: string;
  title: string;
  conditionKey: string;
  reason: string;
  detail: string | null;
  raisedAtUtc: string;
}

export interface ConveningData {
  waiting: ConveningProposalDto[];
  decided: ConveningProposalDto[];
  withheld: ConveningWithheldDto[];
  withheldNotShown: number;
  raisedThisWeek: number;
  weeklyCap: number;
}

export interface GetConveningProposalsResponse {
  data: ConveningData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_CONVENING },
} = API_ENDPOINTS;

// Three lists, and `withheld` is not an appendix — it's what mapped to a condition and then
// couldn't proceed (missing source, no stage owner, weekly cap, a room already open), so a quiet
// week can be told apart from one where every detection died on a missing source.
export const getConveningProposals = async (
  params?: GetConveningProposalsParams
): Promise<GetConveningProposalsResponse> => {
  try {
    const response = await axiosInstance.get<GetConveningProposalsResponse>(GET_CONVENING, {
      params,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch convening proposals");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
