import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UpdateStageConversionPayload {
  stageKey: string;
  /** Must be one of the current definition's exit-rule conditionKeys. Pass null to clear the binding. */
  conditionKey: string | null;
}

export interface UpdateStageConversionResponse {
  data: null;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { UPDATE_STAGE_CONVERSION },
} = API_ENDPOINTS;

// Owner-or-admin only server-side. Deliberately no blast-radius preview, unlike a definition
// edit — binding a conversion moves no population and restates nothing.
export const updateStageConversion = async ({
  stageKey,
  conditionKey,
}: UpdateStageConversionPayload): Promise<UpdateStageConversionResponse> => {
  try {
    const response = await axiosInstance.put<UpdateStageConversionResponse>(
      UPDATE_STAGE_CONVERSION.replace("{stageKey}", stageKey),
      { conditionKey },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to update the stage's conversion");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
