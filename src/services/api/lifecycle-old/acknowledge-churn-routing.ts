import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface AcknowledgeChurnRoutingPayload {
  routingId: string;
  note: string | null;
}

export interface AcknowledgeChurnRoutingResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { ACKNOWLEDGE_CHURN_ROUTING },
} = API_ENDPOINTS;

// Anybody in the workspace may acknowledge, including on a stage nobody owns. A second
// acknowledgement is refused rather than overwriting who answered first.
export const acknowledgeChurnRouting = async ({
  routingId,
  note,
}: AcknowledgeChurnRoutingPayload): Promise<AcknowledgeChurnRoutingResponse> => {
  try {
    const response = await axiosInstance.post<AcknowledgeChurnRoutingResponse>(
      ACKNOWLEDGE_CHURN_ROUTING.replace("{routingId}", routingId),
      { note },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to acknowledge the routing");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
