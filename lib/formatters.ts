import { ErrorResponse } from "@/types/api";
import { capitalize } from "./utils";

export const formatErrorResponse = (errors: ErrorResponse): string => {
  return Object.entries(errors)
    .map(([field, messages]) => `${capitalize(field)}: ${messages.join(", ")}`)
    .join("\n");
};
