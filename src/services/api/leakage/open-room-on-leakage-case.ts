import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";

// Scaffolded 2026-10-01, corrected 2026-10-02 against the real Scalar schema the user pasted —
// two real surprises caught there, not visible from the doc's prose alone:
// 1. `data` is a bare string (the room id itself), not `{ roomId: string, ... }` as first guessed —
//    there is no wrapper object.
// 2. `lifecycleClass`/`mode` on THIS route's body are PascalCase ("InFlight", "Gross") — a THIRD
//    casing convention on top of the two already documented on the main page (lowercase in
//    `controls.*` option lists, UPPERCASE on record fields like `amounts[].lifecycleClass`). Sending
//    the page's own lowercase/uppercase filter values here as-is would be wrong; see
//    `toRoomLifecycleClass`/`toRoomMode` below.

const ROOM_LIFECYCLE_CLASS: Record<string, "Realized" | "InFlight" | "Latent"> = {
  realized: "Realized",
  in_flight: "InFlight",
  latent: "Latent",
};

const ROOM_MODE: Record<string, "Gross" | "Expected" | "Net"> = {
  gross: "Gross",
  expected: "Expected",
  net: "Net",
};

/** Converts the page's own lowercase filter value (`controls.lifecycleClass`/`v2Filters.mode`,
 * e.g. `"in_flight"`) to this one route's PascalCase enum — case-insensitive since V2 record
 * fields elsewhere come back UPPERCASE, not lowercase (see docs/leakage-map/v2-build-plan.md
 * Step 0's casing finding). Throws rather than silently sending an unrecognized value. */
export function toRoomLifecycleClass(value: string): "Realized" | "InFlight" | "Latent" {
  const resolved = ROOM_LIFECYCLE_CLASS[value.toLowerCase()];
  if (!resolved) throw new Error(`Unrecognized lifecycle class for opening a Room: "${value}"`);
  return resolved;
}

export function toRoomMode(value: string): "Gross" | "Expected" | "Net" {
  const resolved = ROOM_MODE[value.toLowerCase()];
  if (!resolved) throw new Error(`Unrecognized mode for opening a Room: "${value}"`);
  return resolved;
}

export interface OpenRoomOnLeakageCasePayload {
  caseId: string;
  currency: string;
  market?: string | null;
  lifecycleClass: "Realized" | "InFlight" | "Latent" | null;
  mode: "Gross" | "Expected" | "Net";
  title?: string | null;
}

/** The response's `data` is the new/existing Room's id, nothing more. */
export interface OpenRoomOnLeakageCaseResponse {
  data: string;
  messages: string[];
  succeeded: boolean;
}

const {
  LEAKAGE: { OPEN_ROOM_ON_LEAKAGE_CASE },
} = API_ENDPOINTS;

export const openRoomOnLeakageCase = async ({
  caseId,
  currency,
  market,
  lifecycleClass,
  mode,
  title,
}: OpenRoomOnLeakageCasePayload): Promise<OpenRoomOnLeakageCaseResponse> => {
  try {
    const response = await axiosInstance.post<OpenRoomOnLeakageCaseResponse>(
      OPEN_ROOM_ON_LEAKAGE_CASE.replace("{caseId}", caseId),
      { currency, market, lifecycleClass, mode, title },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to open a room on this case");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
