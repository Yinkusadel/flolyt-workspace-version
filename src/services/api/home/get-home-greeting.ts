import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface HomeGreetingDto {
  greeting: string;
}

export interface GetHomeGreetingResponse {
  data: HomeGreetingDto;
  messages: string[];
  succeeded: boolean;
}

const {
  HOME: { GET_GREETING },
} = API_ENDPOINTS;

export const getHomeGreeting = async (): Promise<GetHomeGreetingResponse> => {
  try {
    const response = await axiosInstance.get<GetHomeGreetingResponse>(GET_GREETING);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch greeting");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
