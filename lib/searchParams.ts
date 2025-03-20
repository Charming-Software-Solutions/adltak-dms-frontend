import { parseAsString, createLoader } from "nuqs/server";

export const activityLogSearchParams = {
  role: parseAsString.withDefault(""),
  type: parseAsString.withDefault(""),
  module: parseAsString.withDefault(""),
};

export const loadActivityLogSearchPrams = createLoader(activityLogSearchParams);
