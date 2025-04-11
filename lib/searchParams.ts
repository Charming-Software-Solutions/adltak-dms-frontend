import { createLoader, parseAsIsoDateTime, parseAsString } from "nuqs/server";

// Parsers

export const activityLogParsers = {
  role: parseAsString.withDefault(""),
  type: parseAsString.withDefault(""),
  module: parseAsString.withDefault(""),
};
export const productParsers = {
  brand: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  product_type: parseAsString.withDefault(""),
};
export const projectParsers = {
  status: parseAsString.withDefault(""),
  start_date: parseAsIsoDateTime,
  end_date: parseAsIsoDateTime,
};
export const taskParsers = {
  status: parseAsString.withDefault(""),
  start_date: parseAsIsoDateTime,
  end_date: parseAsIsoDateTime,
};

export const materialParsers = {
  brand: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  material_type: parseAsString.withDefault(""),
};

// Loader Exports
export const loadActivityLogSearchPrams = createLoader(activityLogParsers);
export const loadProductSearchParams = createLoader(productParsers);
export const loadProjectSearchParams = createLoader(projectParsers);
export const loadTaskSearchParams = createLoader(taskParsers);
export const loadMaterialSearchParams = createLoader(materialParsers);
