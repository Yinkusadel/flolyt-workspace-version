import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface WithdrawDissentResponse {
  data: boolean;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { WITHDRAW_DISSENT },
} = API_ENDPOINTS;

// A state change, not a delete — wording stays, marked withdrawn. Author only.
export const withdrawDissent = async (dissentId: string): Promise<WithdrawDissentResponse> => {
  try {
    const response = await axiosInstance.delete<WithdrawDissentResponse>(
      WITHDRAW_DISSENT.replace("{dissentId}", dissentId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to withdraw the objection");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
