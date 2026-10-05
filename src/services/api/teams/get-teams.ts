import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface TeamDto {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  dateCreated: string;
  isActive: boolean;
}

export interface GetTeamsParams {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface GetTeamsResponse {
  data: TeamDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  TEAMS: { GET_TEAMS },
} = API_ENDPOINTS;

export const getTeams = async (params?: GetTeamsParams): Promise<GetTeamsResponse> => {
  try {
    const response = await axiosInstance.get<GetTeamsResponse>(GET_TEAMS, { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch teams");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
