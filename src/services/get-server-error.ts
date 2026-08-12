export const getServerErrorMessage = (data: any): string => {
  if (!data) return "";

  if (Array.isArray(data.messages) && data.messages.length > 0) {
    return data.messages.join(", "); // combine all messages
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data === "string") {
    return data;
  }

  // fallback for unexpected structures
  return JSON.stringify(data);
};
