import { MaterialIssueEnum, MaterialStatusEnum } from "@/enums";
import { BaseModel, Classification } from "./generics";
import { MATERIAL_STATUS } from "@/constants";

export type MaterialIssue = BaseModel & {
  quantity: number;
  resolved: boolean;
};

export type Material = BaseModel & {
  name: string;
  thumbnail?: string;
  code: string;
  type: Classification;
  status: MaterialStatusEnum;
  stock: number;
  brand: Classification;
  area: string;
  agency: string;
  archived: boolean;
  issues: Record<MaterialIssueEnum, MaterialIssue>;
};

export type MaterialStatus = keyof typeof MATERIAL_STATUS;
