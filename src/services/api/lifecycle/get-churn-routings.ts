import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";
import type { CauseEvidenceDto } from "@/services/api/lifecycle/route-churn-upstream";

export interface ChurnRoutingDto {
  id: string;
  causeKey: string;
  causeLabel: string;
  targetStageKey: string;
  targetStageName: string;
  targetUserId: string | null;
  isUndeliverable: boolean;
  evidence: CauseEvidenceDto[];
  note: string | null;
  routedByUserId: string;
  routedAtUtc: string;
  acknowledgedAtUtc: string | null;
  acknowledgedByUserId: string | null;
  acknowledgementNote: string | null;
}

export interface GetChurnRoutingsData {
  /** Unanswered first, then newest. */
  routings: ChurnRoutingDto[];
  unanswered: number;
  /** Routings pointing at stages nobody owns — the dead ends, left visible on purpose. */
  undeliverable: number;
  callouts: LifecycleCalloutDto[];
}

export interface GetChurnRoutingsResponse {
  data: GetChurnRoutingsData;
  messages: string[];
  succeeded: boolean;
}

export interface GetChurnRoutingsParams {
  stage?: string;
}

const {
  LIFECYCLE: { GET_CHURN_ROUTINGS },
} = API_ENDPOINTS;

export const getChurnRoutings = async (
  params?: GetChurnRoutingsParams
): Promise<GetChurnRoutingsResponse> => {
  try {
    const response = await axiosInstance.get<GetChurnRoutingsResponse>(GET_CHURN_ROUTINGS, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch churn routings");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
