import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  phoneNumber: string;
}

export interface GetUserByEmailResponse {
  data: UserDto;
  messages: string[];
  succeeded: boolean;
}

const {
  USER: { GET_USER_BY_EMAIL },
} = API_ENDPOINTS;

export const getUserByEmail = async (email: string): Promise<GetUserByEmailResponse> => {
  try {
    const response = await axiosInstance.get<GetUserByEmailResponse>(
      GET_USER_BY_EMAIL.replace("{email}", encodeURIComponent(email))
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch user by email");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
