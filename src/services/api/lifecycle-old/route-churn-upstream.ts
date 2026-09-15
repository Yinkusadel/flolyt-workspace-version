import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CauseEvidenceDto {
  kind: string;
  reference: string;
  note: string | null;
}

export interface RouteChurnUpstreamPayload {
  causeKey: string;
  /** One of the ten stages — cannot be "churn" itself. */
  targetStageKey: string;
  evidence: CauseEvidenceDto[] | null;
  note: string | null;
}

export interface RouteChurnUpstreamResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { ROUTE_CHURN_UPSTREAM },
} = API_ENDPOINTS;

// Each evidence item must exist in this workspace or the whole routing is refused. If the
// target stage has no owner the routing is still recorded pointing at it, with an empty
// destination — never silently redirected to whoever's nearest.
export const routeChurnUpstream = async (
  payload: RouteChurnUpstreamPayload
): Promise<RouteChurnUpstreamResponse> => {
  try {
    const response = await axiosInstance.post<RouteChurnUpstreamResponse>(ROUTE_CHURN_UPSTREAM, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to route the churn cause upstream");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
