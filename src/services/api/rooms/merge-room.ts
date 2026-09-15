import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface MergeRoomPayload {
  roomId: string;
  survivingRoomId: string;
  ownerMemberId: string;
}

export interface MergeRoomResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { MERGE_ROOM },
} = API_ENDPOINTS;

// Nothing is deleted — both decision docs, threads, and logs survive. Merging into an
// already-merged room is refused rather than chained.
export const mergeRoom = async ({
  roomId,
  ...payload
}: MergeRoomPayload): Promise<MergeRoomResponse> => {
  try {
    const response = await axiosInstance.post<MergeRoomResponse>(
      MERGE_ROOM.replace("{roomId}", roomId),
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to merge the rooms");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
