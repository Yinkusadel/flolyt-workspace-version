import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CloseInstrumentationRequestPayload {
  obligationId: string;
  resolved: boolean;
  /** A withdrawal (resolved: false) needs a reason here, or the next person just raises the same request again. */
  note?: string | null;
}

export interface CloseInstrumentationRequestResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { CLOSE_INSTRUMENTATION_REQUEST },
} = API_ENDPOINTS;

// Closeable by whoever raised it, its assigned owner, or an administrator.
export const closeInstrumentationRequest = async ({
  obligationId,
  ...payload
}: CloseInstrumentationRequestPayload): Promise<CloseInstrumentationRequestResponse> => {
  try {
    const response = await axiosInstance.post<CloseInstrumentationRequestResponse>(
      CLOSE_INSTRUMENTATION_REQUEST.replace("{obligationId}", obligationId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to close the instrumentation request");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
