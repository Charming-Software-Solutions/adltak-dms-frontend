import { DistributionStatusesEnum } from "@/enums";
import { Product } from "./product";
import { Employee } from "./user";
import { DISTRIBUTION_STATUSES } from "@/constants";

export type DistributionProduct = {
  id: string;
  created_at?: string;
  updated_at?: string;
  product: Product;
  quantity: number;
};

export type DistributionType = "IMPORT" | "EXPORT";

export type Distribution = {
  id: string;
  dist_id: string;
  created_at: string;
  updated_at: string;
  products: DistributionProduct[];
  type: DistributionType;
  status: DistributionStatusesEnum;
  client: string;
  employee: string;
};

export type DistributionStatus = keyof typeof DISTRIBUTION_STATUSES;
