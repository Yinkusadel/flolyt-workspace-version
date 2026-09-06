import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RequestThirdReadingPayload {
  conflictId: string;
  question: string;
  runId: string | null;
}

export interface RequestThirdReadingResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { REQUEST_THIRD_READING },
} = API_ENDPOINTS;

// Conflict stays OPEN while the run happens — render as still waiting. `runId` optional; null is
// honest (question recorded either way).
export const requestThirdReading = async ({
  conflictId,
  ...payload
}: RequestThirdReadingPayload): Promise<RequestThirdReadingResponse> => {
  try {
    const response = await axiosInstance.post<RequestThirdReadingResponse>(
      REQUEST_THIRD_READING.replace("{conflictId}", conflictId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to request a third reading");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
