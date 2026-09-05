import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface UpgradePathMoveDto {
  fromPlan: string;
  toPlan: string;
  customers: number;
  share: number | null;
}

export interface ExpandUpgradePathsData {
  /** Cannot tell an upgrade from a downgrade without plan pricing — see this endpoint's callout. */
  moves: UpgradePathMoveDto[];
  movers: number | null;
  windowDays: number;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetExpandUpgradePathsResponse {
  data: ExpandUpgradePathsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_EXPAND_UPGRADE_PATHS },
} = API_ENDPOINTS;

export const getExpandUpgradePaths = async (): Promise<GetExpandUpgradePathsResponse> => {
  try {
    const response = await axiosInstance.get<GetExpandUpgradePathsResponse>(GET_EXPAND_UPGRADE_PATHS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Expand's upgrade paths");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
