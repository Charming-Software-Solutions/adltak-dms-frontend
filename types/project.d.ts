import { GenericStatusEnum, ProjectStatusEnum } from "@/enums";
import { Product } from "./product";
import { Employee } from "./user";
import { PROJECT_STATUSES } from "@/constants";
import { BaseModel } from "./generics";
import { Asset } from "./asset";

export type ProjectProduct = BaseModel & {
  product: Product;
  quantity: number;
  expiration: string;
  status: GenericStatusEnum;
};

export type Project = BaseModel & {
  products: ProjectProduct[];
  name: string;
  ba_reference_number: string;
  status: ProjectStatusEnum;
  client: string;
  employee: string;
};

export type DistributionStatus = keyof typeof PROJECT_STATUSES;
