import { ErrorResponse } from "@/types/api";

export const formatErrorResponse = (errors: ErrorResponse): string => {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("\n");
};
