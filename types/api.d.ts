type ErrorField = string[];
export type ErrorResponse = {
  [key: string]: ErrorField;
};

export type ApiResponse<T> = {
  status: number;
  data: T | null;
  errors: ErrorResponse | null;
};
