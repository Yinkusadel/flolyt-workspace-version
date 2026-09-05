import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateInstrumentationRequestPayload {
  gap: string;
  gapKey: string;
  neededByUtc: string;
  blocks?: string[] | null;
  ownerUserId?: string | null;
  /** The point of the request — "please instrument loyalty" is a conversation, an event schema is a contract. */
  requiredEventSchemas?: string[] | null;
}

export interface CreateInstrumentationRequestResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { CREATE_INSTRUMENTATION_REQUEST },
} = API_ENDPOINTS;

// A neededByUtc already in the past is refused. One live request per gap.
export const createInstrumentationRequest = async (
  payload: CreateInstrumentationRequestPayload
): Promise<CreateInstrumentationRequestResponse> => {
  try {
    const response = await axiosInstance.post<CreateInstrumentationRequestResponse>(
      CREATE_INSTRUMENTATION_REQUEST,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to raise the instrumentation request");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
