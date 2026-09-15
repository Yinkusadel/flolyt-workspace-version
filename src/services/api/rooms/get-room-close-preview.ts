import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RoomCloseMeasurementInput } from "@/services/api/rooms/close-room";

export interface RoomClosePreviewOutcomeDto {
  kind: string;
  available: boolean;
  whyNot: string | null;
  needs: string | null;
}

export interface RoomClosePreviewPlanDto {
  holdoutPercent: number | null;
  noHoldoutBecause: string | null;
  measuredOverDays: number;
  primaryMeasure: string;
  revenueBasis: string;
}

export interface RoomClosePreviewWindowDto {
  startUtc: string;
  endUtc: string;
  days: number;
  hasElapsed: boolean;
}

export interface RoomClosePreviewFalsifierDto {
  condition: string;
  thenWhat: string;
  addedAtUtc: string;
  metAtUtc: string | null;
}

export interface RoomClosePreviewDissentDto {
  wording: string;
  by: string;
  recordedAtUtc: string;
  borneOut: boolean | null;
}

export interface RoomClosePreviewLinkedCampaignDto {
  campaignId: string;
  name: string;
  proposalId: string;
  playSummary: string;
  holdoutPercent: number | null;
  treatment: number;
  holdout: number;
  firstEnrolledAtUtc: string | null;
}

export interface RoomClosePreviewData {
  roomId: string;
  title: string;
  openingNumber: number;
  currency: string;
  openedAtUtc: string;
  openDays: number;
  people: number;
  agents: number;
  plays: number;
  playsApproved: number;
  populationAtOpen: number | null;
  amountAtOpen: number | null;
  currentPopulation: number | null;
  currentAmountAtRisk: number | null;
  delta: number | null;
  deltaUnavailableBecause: string | null;
  outcomes: RoomClosePreviewOutcomeDto[];
  plan: RoomClosePreviewPlanDto;
  settlesWhen: string[];
  suggestedWindow: RoomClosePreviewWindowDto;
  expectedHeldBack: number | null;
  measurementMustBeSupplied: boolean;
  measurementMustBeSuppliedBecause: string | null;
  predictions: RoomClosePreviewFalsifierDto[];
  dissent: RoomClosePreviewDissentDto[];
  linkedCampaigns: RoomClosePreviewLinkedCampaignDto[];
  computedMeasurement: RoomCloseMeasurementInput | null;
  measurementUnavailableBecause: string | null;
  incrementalRevenue: number | null;
  holdoutHonoured: boolean | null;
  measurementWindowElapsed: boolean | null;
  conversionsOutsideMarket: number;
}

export interface GetRoomClosePreviewResponse {
  data: RoomClosePreviewData;
  messages: string[];
  succeeded: boolean;
}

const {
  ROOMS: { GET_ROOM_CLOSE_PREVIEW },
} = API_ENDPOINTS;

// Same computation the close endpoint itself uses — dissent/predictions here are exactly what the
// eventual outcome will snapshot, not a separate estimate.
export const getRoomClosePreview = async (roomId: string): Promise<GetRoomClosePreviewResponse> => {
  try {
    const response = await axiosInstance.get<GetRoomClosePreviewResponse>(
      GET_ROOM_CLOSE_PREVIEW.replace("{roomId}", roomId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the room's close preview");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
