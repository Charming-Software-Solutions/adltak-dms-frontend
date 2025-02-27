import { ErrorResponse } from "@/types/api";
import { capitalize } from "./utils";

export const formatErrorResponse = (errors: ErrorResponse): string => {
  return Object.entries(errors)
    .map(([field, messages]) => {
      // Check if messages is an array, if not, convert it to an array
      const messageStr = Array.isArray(messages)
        ? messages.join(", ")
        : messages;
      return `${capitalize(field)}: ${messageStr}`;
    })
    .join("\n");
};
