import axios from "axios";
import { API_ENDPOINTS } from "@//config/apiConfig";

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
    const response = await axios.get<GetUserByEmailResponse>(
      GET_USER_BY_EMAIL.replace("{email}", encodeURIComponent(email)),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch user by email");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
