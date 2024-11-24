export type SelectItemType = {
  label: string;
  value: string;
};

type AppliedFilters<T extends Record<string, string | undefined>> = {
  [K in keyof T]: T[K];
};
