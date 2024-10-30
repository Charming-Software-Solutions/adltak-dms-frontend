import { DistributionStatus } from "@/types/distribution";

export interface ICreateProduct {
  sku: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  stock: number;
}

export interface ICreateUser {
  email: string;
  password: string;
}

export interface ICreateDistributionProduct {
  product: string;
  quantity: number;
}

export interface ICreateDistribution {
  employee: string;
  products: {
    product: string;
    quantity: number;
  }[];
  type: string;
  status: DistributionStatus;
  client: string;
}

export interface ICreateTask {
  employee: string;
  distribution: string;
}

export interface ICreateAsset {
  name: string;
  code: string;
  type: string;
}
