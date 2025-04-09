import { MaterialConditionEnum, MaterialStatusEnum } from "@/enums";
import { BaseModel, Classification } from "./generics";
import { MATERIAL_STATUS } from "@/constants";

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
};

export type MaterialStatus = keyof typeof MATERIAL_STATUS;
