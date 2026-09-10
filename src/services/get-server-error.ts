export const getServerErrorMessage = (data: any): string => {
  if (!data) return "";

  if (Array.isArray(data.messages) && data.messages.length > 0) {
    return data.messages.join(", "); // combine all messages
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  // Wallet endpoints respond with their own {status, responseMessage} shape, not the standard
  // envelope's messages[]/message — see docs/endpoints/wallet.md.
  if (typeof data.responseMessage === "string") {
    return data.responseMessage;
  }

  if (typeof data === "string") {
    return data;
  }

  // fallback for unexpected structures
  return JSON.stringify(data);
};
