import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface InboxThreadRoomDto {
  id: string;
  title: string;
  status: string;
  isRestricted: boolean;
  stageLabel: string | null;
  conditionLabel: string | null;
  currency: string | null;
  amountAtRisk: number | null;
}

export interface InboxThreadMessageDto {
  id: string;
  sender: string;
  senderName: string;
  isAgent: boolean;
  body: string;
  roomId: string | null;
  room: InboxThreadRoomDto | null;
  sentAtUtc: string;
}

export interface InboxThreadDetailDto {
  threadId: string;
  participants: string[];
  messages: InboxThreadMessageDto[];
}

export interface GetInboxThreadResponse {
  data: InboxThreadDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  INBOX: { GET_INBOX_THREAD },
} = API_ENDPOINTS;

// senderName is resolved at read time, not stored — a departed member reads as "Someone no
// longer here" rather than dropping their messages. Drafts never appear here.
export const getInboxThread = async (threadId: string): Promise<GetInboxThreadResponse> => {
  try {
    const response = await axiosInstance.get<GetInboxThreadResponse>(
      GET_INBOX_THREAD.replace("{threadId}", threadId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the conversation");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
