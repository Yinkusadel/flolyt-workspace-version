import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface AcceptThreatRecurrencePayload {
  previousCaseId: string;
  /** The current revision of the closed case; an old one fails. */
  expectedRevision: number;
  reason: string;
}

export interface AcceptThreatRecurrenceResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { ACCEPT_THREAT_RECURRENCE },
} = API_ENDPOINTS;

// Returns the new case ID (a retry returns the same one). Acceptance does not guarantee a Room:
// the evidence, triage, readiness and confirmation gates run again. The previous Room must be closed.
export const acceptThreatRecurrence = async (payload: AcceptThreatRecurrencePayload): Promise<AcceptThreatRecurrenceResponse> => {
  try {
    const response = await axiosInstance.post<AcceptThreatRecurrenceResponse>(
      ACCEPT_THREAT_RECURRENCE,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to accept the recurrence");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
