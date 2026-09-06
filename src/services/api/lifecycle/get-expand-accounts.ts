import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface ExpandAtRiskAccountDto {
  customer: string;
  plan: string | null;
  endsAtUtc: string;
  daysToRenewal: number;
  value: number | null;
  currency: string | null;
  /** Signals, never a fused score — each row lists which signals fired, nothing blended. */
  signals: string[];
  paymentsFailed: number | null;
  tickets: number | null;
}

export interface ExpandAccountsData {
  atRisk: ExpandAtRiskAccountDto[];
  owner: string | null;
  /** Which signals this workspace could be evaluated for at all — a renewal absent from atRisk
   * has been cleared on only these, a weaker statement than it looks. */
  checked: string[];
  atRiskCount: number | null;
  horizonDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetExpandAccountsResponse {
  data: ExpandAccountsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_EXPAND_ACCOUNTS },
} = API_ENDPOINTS;

export const getExpandAccounts = async (): Promise<GetExpandAccountsResponse> => {
  try {
    const response = await axiosInstance.get<GetExpandAccountsResponse>(GET_EXPAND_ACCOUNTS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Expand's at-risk accounts");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
