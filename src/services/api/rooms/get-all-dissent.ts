import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface GetAllDissentParams {
  /** Default false. */
  includeWithdrawn?: boolean;
  /** Default 50. */
  take?: number;
}

export interface RoomAllDissentRowDto {
  id: string;
  wording: string;
  roomId: string;
  roomTitle: string;
  byUserId: string;
  byLabel: string;
  recordedAtUtc: string;
  roomStatus: string;
  withdrawn: boolean;
  borneOut: boolean | null;
}

export interface AllDissentData {
  dissent: RoomAllDissentRowDto[];
  returned: number;
  truncated: boolean;
}

export interface GetAllDissentResponse {
  data: AllDissentData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ALL_DISSENT },
} = API_ENDPOINTS;

export const getAllDissent = async (
  params?: GetAllDissentParams
): Promise<GetAllDissentResponse> => {
  try {
    const response = await axiosInstance.get<GetAllDissentResponse>(GET_ALL_DISSENT, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the dissent register");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
