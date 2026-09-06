import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface MeasureEntryEventResponse {
  data: number;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { MEASURE_ENTRY_EVENT },
} = API_ENDPOINTS;

// ❓ docs/endpoints/lifecycle.md only documents a `force` query param for this endpoint — no
// path/body field identifying *which* candidate entry event to count. That looks like a doc gap
// (the purpose line says "each candidate entry event"); ask backend before wiring this into the
// definition screen. Implemented exactly as documented in the meantime.
// Counts are cached for a day unless force=true; bounded per call with a timeout.
export const measureEntryEvent = async (force = false): Promise<MeasureEntryEventResponse> => {
  try {
    const response = await axiosInstance.post<MeasureEntryEventResponse>(
      MEASURE_ENTRY_EVENT,
      undefined,
      { params: { force } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to measure the entry event");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
