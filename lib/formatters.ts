import { ErrorResponse } from "@/types/api";
import { capitalize } from "./utils";

export const formatErrorResponse = (errors: ErrorResponse): string => {
  // Helper function to recursively extract only the error messages
  const extractMessages = (obj: any): string[] => {
    let messages: string[] = [];
    Object.values(obj).forEach((value) => {
      if (Array.isArray(value)) {
        messages.push(...value);
      } else if (typeof value === "object" && value !== null) {
        messages.push(...extractMessages(value));
      } else {
        messages.push(String(value));
      }
    });
    return messages;
  };

  // Capitalize each message and then join them with a newline.
  return extractMessages(errors)
    .map((msg) => capitalize(msg))
    .join("\n");
};
