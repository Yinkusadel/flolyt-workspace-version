import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreateInboxThreadPayload {
  recipients: string[];
  body: string;
  asDraft?: boolean;
  roomId?: string | null;
}

export interface CreateInboxThreadResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { CREATE_INBOX_THREAD },
} = API_ENDPOINTS;

// recipients are "human:{guid}" member references — people only, agents are reached by opening a
// room or an agent conversation instead.
export const createInboxThread = async (
  payload: CreateInboxThreadPayload
): Promise<CreateInboxThreadResponse> => {
  try {
    const response = await axiosInstance.post<CreateInboxThreadResponse>(
      CREATE_INBOX_THREAD,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to start the conversation");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
