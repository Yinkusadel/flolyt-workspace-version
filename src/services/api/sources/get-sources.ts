import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface SourceRowDto {
  kind: string;
  label: string;
  status: string;
  lastSyncedAtUtc: string | null;
  recordCount: number | null;
  problem: string | null;
  contributingConnections: string[];
  blocks: string[];
}

export interface SourcesData {
  sources: SourceRowDto[];
  connectedCount: number;
  totalCount: number;
}

export interface GetSourcesResponse {
  data: SourcesData;
  messages: string[];
  succeeded: boolean;
}

const {
  SOURCES: { GET_SOURCES },
} = API_ENDPOINTS;

// A row is a data domain, not a connection — every domain is returned including ones nothing
// supplies. No read_only status: every source Flolyt connects is read-only.
export const getSources = async (): Promise<GetSourcesResponse> => {
  try {
    const response = await axiosInstance.get<GetSourcesResponse>(GET_SOURCES);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch sources");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
