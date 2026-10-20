import axios from "axios";
import { getServerErrorMessage } from "@/services/get-server-error";
import type { RelationshipValidationIssue } from "./types";

// Keeps the HTTP status and validation issues that the generic Error loses. The doc asks the
// editor to survive a 409 (revision or source evidence changed) and to show 422 (safe scoped
// preview could not be completed) differently, and 403 means administrator access is required.
export class RelationshipApiError extends Error {
  status: number | null;
  code: string | null;
  validationIssues: RelationshipValidationIssue[];

  constructor(
    message: string,
    status: number | null = null,
    code: string | null = null,
    validationIssues: RelationshipValidationIssue[] = []
  ) {
    super(message);
    this.name = "RelationshipApiError";
    this.status = status;
    this.code = code;
    this.validationIssues = validationIssues;
  }
}

export const toRelationshipError = (error: unknown, fallback: string): RelationshipApiError => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new RelationshipApiError(
        "No response from server. Please check your internet connection and try again."
      );
    }

    const data = error.response.data;
    const issues: RelationshipValidationIssue[] = Array.isArray(data?.validationIssues)
      ? data.validationIssues
      : [];

    return new RelationshipApiError(
      getServerErrorMessage(data) || fallback,
      error.response.status,
      typeof data?.code === "string" ? data.code : null,
      issues
    );
  }

  return new RelationshipApiError(fallback);
};
