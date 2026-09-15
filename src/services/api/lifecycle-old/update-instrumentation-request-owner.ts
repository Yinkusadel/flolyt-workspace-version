import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateInstrumentationRequestOwnerPayload {
  obligationId: string;
  ownerUserId: string;
}

export interface UpdateInstrumentationRequestOwnerResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { UPDATE_INSTRUMENTATION_REQUEST_OWNER },
} = API_ENDPOINTS;

// Separate from raising the request — who does the work is usually settled after the ask.
// Owner is always a person, never a team.
export const updateInstrumentationRequestOwner = async ({
  obligationId,
  ownerUserId,
}: UpdateInstrumentationRequestOwnerPayload): Promise<UpdateInstrumentationRequestOwnerResponse> => {
  try {
    const response = await axiosInstance.put<UpdateInstrumentationRequestOwnerResponse>(
      UPDATE_INSTRUMENTATION_REQUEST_OWNER.replace("{obligationId}", obligationId),
      { ownerUserId },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to assign the instrumentation request's owner");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
