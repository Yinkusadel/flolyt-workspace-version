import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateChangePayload {
  occurredOnUtc: string;
  title: string;
  team?: string;
  description?: string;
  affectedStageKeys?: string[];
  /** Added 2026-09-04. "action" (default) | "absence_of_action" — the latter indexes things that should have happened and didn't, dated from when the omission took effect. */
  kind?: string;
}

export interface CreateChangeResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { CREATE_CHANGE },
} = API_ENDPOINTS;

// A future occurredOnUtc is refused server-side. affectedStageKeys only records intent — it
// never filters what the impact endpoint measures.
export const createChange = async (payload: CreateChangePayload): Promise<CreateChangeResponse> => {
  try {
    const response = await axiosInstance.post<CreateChangeResponse>(CREATE_CHANGE, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to record the change");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
