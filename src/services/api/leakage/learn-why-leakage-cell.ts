import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LearnWhyConversationDto } from "@/services/api/leakage/learn-why-leakage-stage";

export interface LearnWhyLeakageCellParams {
  grid: string;
  row: string;
  condition: string;
  currency: string;
  window?: string | number;
  horizon?: string | number;
}

export interface LearnWhyLeakageCellResponse {
  data: LearnWhyConversationDto;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { LEARN_WHY_LEAKAGE_CELL },
} = API_ENDPOINTS;

// Where Home's prompts point when a suggestion carries a cell coordinate. Answered by the
// specialist of the stage the cell rolls up to, or the workspace's own agent where the axis
// doesn't reach one. Refused on a cell the map isn't showing, or one with no figure behind it.
export const learnWhyLeakageCell = async ({
  grid,
  row,
  condition,
  currency,
  window,
  horizon,
}: LearnWhyLeakageCellParams): Promise<LearnWhyLeakageCellResponse> => {
  try {
    const response = await axiosInstance.post<LearnWhyLeakageCellResponse>(
      LEARN_WHY_LEAKAGE_CELL.replace("{grid}", grid)
        .replace("{row}", row)
        .replace("{condition}", condition)
        .replace("{currency}", currency),
      null,
      { params: { window, horizon } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to ask why this cell is leaking");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
