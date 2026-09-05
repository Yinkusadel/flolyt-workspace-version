import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomPersonDto {
  userId: string;
  role: string;
  maxApprovalReach: number | null;
  addedAtUtc: string;
  addedBy: string | null;
  source: string | null;
}

export interface RoomPeopleRestrictedDto {
  reason: string;
  restrictedBy: string;
  restrictedAtUtc: string;
  peopleInside: number;
}

export interface RoomPersonAgentDto {
  key: string;
  displayName: string;
  role: string;
  whatItWillDo: string;
  reads: string[] | null;
  addedAtUtc: string;
}

export interface RoomPeopleData {
  roomId: string;
  people: RoomPersonDto[];
  restricted: RoomPeopleRestrictedDto | null;
  agents: RoomPersonAgentDto[];
  leadAgentKey: string | null;
  everyoneSeesEverything: boolean;
}

export interface GetRoomPeopleResponse {
  data: RoomPeopleData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_PEOPLE },
} = API_ENDPOINTS;

// Everyone in this list reads every message, finding, and customer in the cohort
// (`everyoneSeesEverything`) — a role changes only who a proposal routes to, never what they can see.
export const getRoomPeople = async (roomId: string): Promise<GetRoomPeopleResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomPeopleResponse>(
      GET_ROOM_PEOPLE.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's people");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
