export type SelectItemType = {
  label: string;
  value: string;
};

type AppliedFilters<T extends Record<string, string | undefined>> = {
  [K in keyof T]: T[K];
};

export type NavItem = {
  name: string;
  route: string;
  icon: React.ReactNode;
};
