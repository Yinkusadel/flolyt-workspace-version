import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import type {
  LeakageCalculationDto,
  LeakageExpectedEntryDto,
  LeakageHorizonDto,
  LeakageSeverityLevelDto,
} from "@/services/api/leakage/get-leakage";

// NOT confirmed against a real response — the example returns bare `null`. Inferred from the
// endpoint's prose ("what moved since a comparable earlier reading"), same caveat as
// LeakageAtStakeEntryDto in get-leakage.ts.
export interface LeakageMovementDto {
  direction: string | null;
  amountChange: number | null;
  percentChange: number | null;
  comparedToLabel: string | null;
}

export interface LeakageCellRoomDto {
  roomId: string;
  title: string;
  openedAtUtc: string;
  ownerMemberId: string | null;
  ownerName: string | null;
  canSeeInside: boolean;
}

export interface LeakageCellDraftDto {
  grid: string;
  rowKey: string;
  conditionKey: string;
  currency: string;
  title: string;
  settlesWhen: string[];
  measuredOverDays: number;
  primaryMeasure: string;
  revenueBasis: string;
  holdoutPercent: number | null;
  wouldProveUsWrong: string | null;
}

// The example's only concrete value is "SourceMissing" — the other two reasons named in the
// endpoint's prose ("a measure Flolyt does not compute yet, or an input never produced") aren't
// spelled out on the wire anywhere in the paste, so this stays a plain string rather than a
// guessed literal union. Confirmed values seen so far: "SourceMissing".
export type LeakageCellGapReason = string;

export interface LeakageCellConnectDto {
  roles: string[];
}

export interface LeakageCellSignalDto {
  name: string;
  description: string;
  leadTime: string;
  kind: string;
  watchable: boolean;
  citation: string;
}

export interface LeakageCellGuidanceDto {
  name: string;
  definition: string;
  leading: string;
  detection: string;
  diagnosis: string;
  fix: string;
  prevention: string;
  impact: string;
  citation: string;
}

export interface LeakageCellDetailDto {
  coordinate: string;
  grid: string;
  rowKey: string;
  rowLabel: string;
  conditionKey: string;
  conditionLabel: string;
  label: string;
  currency: string;
  windowDays: number;
  state: string;
  amount: number | null;
  customers: number | null;
  movement: LeakageMovementDto | null;
  expected: LeakageExpectedEntryDto | null;
  horizon: LeakageHorizonDto;
  severity: LeakageSeverityLevelDto;
  /** Present once a room is already open on this coordinate — clicking the cell joins it. */
  room: LeakageCellRoomDto | null;
  /** What opening a new room from this cell would use — never a default the UI invents itself. */
  draft: LeakageCellDraftDto | null;
  /** Set on a gap cell; `null` on a measured one. */
  reason: LeakageCellGapReason | null;
  missingSource: string | null;
  wouldUnlock: string | null;
  explanation: string | null;
  /** How many other cells the same missing source would fill, on a gap cell. */
  alsoFills: number | null;
  connect: LeakageCellConnectDto | null;
  neverEstimated: boolean;
  calculation: LeakageCalculationDto;
  computedAtUtc: string;
  realized: number | null;
  signals: LeakageCellSignalDto[];
  guidance: LeakageCellGuidanceDto[];
}

export interface GetLeakageCellParams {
  grid: string;
  row: string;
  condition: string;
  currency: string;
  window?: string | number;
  horizon?: string | number;
}

export interface GetLeakageCellResponse {
  data: LeakageCellDetailDto;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { GET_LEAKAGE_CELL },
} = API_ENDPOINTS;

export const getLeakageCell = async ({
  grid,
  row,
  condition,
  currency,
  window,
  horizon,
}: GetLeakageCellParams): Promise<GetLeakageCellResponse> => {
  try {
    const response = await axiosInstance.get<GetLeakageCellResponse>(
      GET_LEAKAGE_CELL.replace("{grid}", grid)
        .replace("{row}", row)
        .replace("{condition}", condition)
        .replace("{currency}", currency),
      { params: { window, horizon } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to fetch this cell");
    }
    throw new Error(
      "No response from server. Please check your internet connection and try again."
    );
  }
};
