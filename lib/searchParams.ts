import { createLoader, parseAsString } from "nuqs/server";

export const activityLogSearchParams = {
  role: parseAsString.withDefault(""),
  type: parseAsString.withDefault(""),
  module: parseAsString.withDefault(""),
};

export const productParsers = {
  brand: parseAsString.withDefault(""),
};

export const loadActivityLogSearchPrams = createLoader(activityLogSearchParams);
export const loadProductSearchParams = createLoader(productParsers);
