import { Product } from "./product";
import { Employee } from "./user";

export type DistributionProduct = {
  id: string;
  created_at?: string;
  updated_at?: string;
  product: Product;
  quantity: number;
};

export type DistributionStatus =
  | "Pending"
  | "In Transit"
  | "Delivered"
  | "Cancelled"
  | "Returned"
  | "On Hold"
  | "Completed"
  | "Failed"
  | "Scheduled";

export type DistributionType = "IMPORT" | "EXPORT";

export type Distribution = {
  id: string;
  dist_id: string;
  created_at: string;
  updated_at: string;
  products: DistributionProduct[];
  type: DistributionType;
  status: DistributionStatus;
  client: string;
  employee: string;
};
