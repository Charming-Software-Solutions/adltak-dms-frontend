type ViewConfig<T extends string> = {
  [K in T]: boolean;
};

interface ColumnsConfig<T extends string> {
  desktop: ViewConfig<T>;
  mobile: Partial<ViewConfig<T>>;
}

// Helper function to create typed column config
export function createColumnConfig<T extends string>(config: ColumnsConfig<T>) {
  return config;
}
