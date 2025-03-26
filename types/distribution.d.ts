import { DistributionStatusesEnum } from "@/enums";
import { Product } from "./product";
import { Employee } from "./user";
import { DISTRIBUTION_STATUSES } from "@/constants";
import { BaseModel } from "./generics";
import { Asset } from "./asset";

export type DistributionItem<T> = BaseModel & {
  item: T;
  quantity: number;
};

export type DistributionAsset = BaseModel & {
  asset: Asset;
  quantity: number;
};

export type DistributionProduct = BaseModel & {
  product: Product;
  quantity: number;
  expiration: string;
};

export type DistributionType = "IMPORT" | "EXPORT";

export type Distribution = {
  id: string;
  dist_id: string;
  created_at: string;
  updated_at: string;
  products: DistributionProduct[];
  assets?: DistributionAsset[];
  ba_reference_number?: string;
  type: DistributionType;
  status: DistributionStatusesEnum;
  client: string;
  employee: string;
};

export type DistributionStatus = keyof typeof DISTRIBUTION_STATUSES;
