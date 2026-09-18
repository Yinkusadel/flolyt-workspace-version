import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

export interface RoomMergeCandidateDto {
  roomId: string;
  title: string;
  ownerMemberId: string | null;
  conditionKey: string;
  stageLabel: string;
  theirPopulation: number | null;
  sharedCustomers: number;
  oursForShared: number | null;
  theirsForShared: number | null;
  countedTwiceAtLeast: number | null;
  currency: string | null;
  sameCondition: boolean;
  theirOpenedAtUtc: string;
  alreadyMerged: boolean;
  alreadyLinked: boolean;
}

export interface MergeCandidatesData {
  roomId: string;
  population: number | null;
  candidates: RoomMergeCandidateDto[];
  notYetComputed: boolean;
  absentBecause: string | null;
}

export interface GetMergeCandidatesResponse {
  data: MergeCandidatesData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_MERGE_CANDIDATES },
} = API_ENDPOINTS;

// `countedTwiceAtLeast` is a floor, not a total — render as "at least." Restricted rooms are
// absent here (unlike the collision check) — merging needs an owner and a decision taken in
// front of both people.
export const getMergeCandidates = async (roomId: string): Promise<GetMergeCandidatesResponse> => {
  try {
    const response = await axiosInstance.get<GetMergeCandidatesResponse>(
      GET_MERGE_CANDIDATES.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch merge candidates");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
