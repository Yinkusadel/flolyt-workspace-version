import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { LifecycleCalloutDto } from "@/services/api/lifecycle/get-lifecycle-map";

export interface RepeatCurveBucketDto {
  fromDay: number;
  toDay: number | null;
  customers: number;
  share: number | null;
}

export interface RepeatCurvePointDto {
  daysSince: number;
  reached: number;
  returnProbability: number | null;
}

export interface RetainRepeatCurveData {
  stageKey: string;
  stageName: string;
  basis: string;
  basisCaveat: string;
  boundaryDays: number;
  matureFirstTimeBuyers: number | null;
  /** Younger-than-boundary first-time buyers — excluded from every rate, never projected. */
  tooYoungFirstTimeBuyers: number | null;
  buckets: RepeatCurveBucketDto[];
  repeatShareWithinBoundary: number | null;
  neverReturned: number | null;
  /** An open gap counts as not-yet-returned, so this reads conservative near today by construction. */
  points: RepeatCurvePointDto[];
  dailyBoundaryCrossings: number | null;
  computedAtUtc: string | null;
  callouts: LifecycleCalloutDto[];
}

export interface GetRetainRepeatCurveResponse {
  data: RetainRepeatCurveData;
  messages: string[];
  succeeded: boolean;
}

const {
  LIFECYCLE: { GET_RETAIN_REPEAT_CURVE },
} = API_ENDPOINTS;

export const getRetainRepeatCurve = async (): Promise<GetRetainRepeatCurveResponse> => {
  try {
    const response = await axiosInstance.get<GetRetainRepeatCurveResponse>(GET_RETAIN_REPEAT_CURVE);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch Retain's repeat curve");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
