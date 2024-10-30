export type Classification = BaseModel & {
  name: string;
  description: string;
};

export type BaseModel = {
  id: string;
  created_at: string;
  updated_at: string;
};
