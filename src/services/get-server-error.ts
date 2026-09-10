function tryParseJson(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export const getServerErrorMessage = (data: any): string => {
  if (!data) return "";

  if (Array.isArray(data.messages) && data.messages.length > 0) {
    return data.messages.join(", "); // combine all messages
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  // Wallet endpoints respond with their own {status, responseMessage} shape, not the standard
  // envelope's messages[]/message — see docs/endpoints/wallet.md. On a validation error,
  // responseMessage is itself a JSON-encoded string (e.g. `{"message":"...","data":{"redirect_url":
  // {"message":"redirect_url should be a string"}}}`) — unwrap it instead of showing raw JSON text.
  // Confirmed live 2026-09-10.
  if (typeof data.responseMessage === "string") {
    const nested = tryParseJson(data.responseMessage);
    if (nested && typeof nested.message === "string") {
      const fieldErrors =
        nested.data && typeof nested.data === "object"
          ? Object.values(nested.data as Record<string, { message?: string }>)
              .map((field) => field?.message)
              .filter((message): message is string => typeof message === "string")
          : [];
      return fieldErrors.length ? `${nested.message} (${fieldErrors.join(", ")})` : nested.message;
    }
    return data.responseMessage;
  }

  if (typeof data === "string") {
    return data;
  }

  // fallback for unexpected structures
  return JSON.stringify(data);
};
