import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

// status: "built" | "source-missing" | "not-built" (currently 0 occupants workspace-wide).
export interface StageScreenDto {
  key: string;
  name: string;
  answers: string;
  isBuilt: boolean;
  status: string;
  route: string | null;
  needs: string | null;
  blocked: string | null;
  wouldUnlock: string | null;
}

export interface StageScreensData {
  stageKey: string;
  stageName: string;
  /** Stage-specific tabs only — the 9 tabs every stage shares are not listed here. */
  screens: StageScreenDto[];
  built: number;
  gated: number;
  unbuilt: number;
  callouts: LifecycleCalloutDto[];
}

export interface GetStageScreensResponse {
  data: StageScreensData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_STAGE_SCREENS },
} = API_ENDPOINTS;

// One registry call for a stage's whole tab bar instead of ~28 endpoints each individually
// returning "unavailable" — see docs/endpoints/lifecycle-reference.md §3 for the full status
// semantics. Advocate's Rewards tab is the one permanent "source-missing" that a data connection
// can never close (needs a causal holdout, not a source).
export const getStageScreens = async (stageKey: string): Promise<GetStageScreensResponse> => {
  try {
    const response = await axiosInstance.get<GetStageScreensResponse>(
      GET_STAGE_SCREENS.replace("{stageKey}", stageKey)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch the stage's screens");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
