import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// Shape not documented beyond "MCP-inferred schema JSON" and a `null` example — treat as
// opaque until a real connected datasource shows what it actually returns.
export interface GetDatasourceMcpSchemaResponse {
  data: unknown;
  messages: string[];
  succeeded: boolean;
}

const {
  DATASOURCES: { GET_DATASOURCE_MCP_SCHEMA },
} = API_ENDPOINTS;

export const getDatasourceMcpSchema = async (
  id: string
): Promise<GetDatasourceMcpSchemaResponse> => {
  try {
    const response = await axiosInstance.get<GetDatasourceMcpSchemaResponse>(
      GET_DATASOURCE_MCP_SCHEMA.replace("{id}", id)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch datasource schema");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
