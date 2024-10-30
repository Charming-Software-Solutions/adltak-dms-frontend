import { AssetConditionEnum, AssetStatusEnum } from "@/enums";
import { BaseModel, Classification } from "./generics";
import { ASSET_STATUS } from "@/constants";

export type Asset = BaseModel & {
  name: string;
  thumbnail?: string;
  code: string;
  description?: string;
  type: Classification;
  status: AssetStatusEnum;
  condition: AssetConditionEnum;
  stock: number;
};

export type AssetStatus = keyof typeof ASSET_STATUS;
