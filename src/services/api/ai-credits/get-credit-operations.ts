import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface CreditOperationDto {
  name: string;
  displayName: string;
  description: string;
  creditCost: number;
}

export interface GetCreditOperationsResponse {
  data: CreditOperationDto[];
  messages: string[];
  succeeded: boolean;
}

const {
  AICREDITS: { GET_OPERATIONS },
} = API_ENDPOINTS;

export const getCreditOperations = async (): Promise<GetCreditOperationsResponse> => {
  try {
    const response = await axiosInstance.get<GetCreditOperationsResponse>(GET_OPERATIONS);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch credit operations");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
