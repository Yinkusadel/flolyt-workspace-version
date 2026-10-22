import axios from "axios";
import { axiosInstance } from "@/services/index.service";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { getServerErrorMessage } from "@/services/get-server-error";
import { roomError, roomLog } from "@/features/rooms/live/room-thread-log";
import type { ConversationReplyMode } from "@/features/ai-conversations/ai-conversation-types";

export interface SendRoomMessagePayload {
  conversationId: string;
  message: string;
  replyMode: ConversationReplyMode;
}

/** What the Room thread needs from the receipt: a run started (202) or not (200, `replyMode: "none"`). */
export interface SendRoomMessageReceipt {
  runId: string | null;
  agentKey: string | null;
}

const {
  AI_CONVERSATIONS: { SEND_MESSAGE },
} = API_ENDPOINTS;

type ReceiptShape = { runId?: string | null; agentKey?: string | null };

/**
 * `POST /api/v3/conversations/messages` with `Accept: application/json`, the Room's own `conversationId`.
 * The Room thread renders from the conversation, never from this response: a 202 is only a receipt for the
 * run that started (merge by `runId`), `replyMode: "none"` returns 200 with no run. Stored `@[agent:key]`
 * mentions in `message` pick the responder.
 */
export const sendRoomMessage = async (payload: SendRoomMessagePayload): Promise<SendRoomMessageReceipt> => {
  try {
    roomLog("Send request", { at: new Date().toISOString(), conversationId: payload.conversationId, replyMode: payload.replyMode, message: payload.message });
    const response = await axiosInstance.post<ReceiptShape & { data?: ReceiptShape | null }>(SEND_MESSAGE, payload, {
      headers: { Accept: "application/json", "X-Flolyt-Agent-Contract": "v3" },
    });
    // The receipt's envelope is unconfirmed (docs describe the bare fields); accept either until a live capture.
    roomLog("Send response", { at: new Date().toISOString(), status: response.status, body: response.data });
    const receipt = response.data?.data ?? response.data ?? {};
    return { runId: receipt.runId ?? null, agentKey: receipt.agentKey ?? null };
  } catch (error: unknown) {
    roomError("Send failed", error);
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response ? getServerErrorMessage(error.response.data) : null;
      throw new Error(serverMessage || "Failed to send the message");
    }
    throw new Error("No response from server. Please check your internet connection and try again.");
  }
};
