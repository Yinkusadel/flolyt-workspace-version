import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LeakageConditionApplicability } from "@/services/api/leakage/get-leakage";

export interface LeakageConditionOverrideDto {
  applicability: LeakageConditionApplicability;
  because: string;
  setByUserId: string;
  setByName: string;
  setAtUtc: string;
}

export interface LeakageConditionDto {
  key: string;
  label: string;
  revenueModel: string;
  applicability: LeakageConditionApplicability;
  because: string;
  decidedBy: string;
  measurable: boolean;
  override: LeakageConditionOverrideDto | null;
}

export interface LeakageConditionsData {
  revenueModel: string | null;
  conditions: LeakageConditionDto[];
}

export interface GetLeakageConditionsResponse {
  data: LeakageConditionsData;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CONDITIONS },
} = API_ENDPOINTS;

export const getLeakageConditions = async (): Promise<GetLeakageConditionsResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageConditionsResponse>(
      GET_LEAKAGE_CONDITIONS
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the leakage conditions");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
