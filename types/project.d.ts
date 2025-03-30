import {
  TaskStatusEnum,
  ProjectStatusEnum,
  IncomingProductsStatus,
} from "@/enums";
import { Product } from "./product";
import { Employee } from "./user";
import { PROJECT_STATUSES } from "@/constants";
import { BaseModel } from "./generics";
import { Asset } from "./asset";

export type ProjectProduct = BaseModel & {
  product: Product;
  quantity: number;
  expiration: string;
};

export type Project = BaseModel & {
  products: ProjectProduct[];
  name: string;
  ba_reference_number: string;
  status: ProjectStatusEnum;
  incoming_products_status: IncomingProductsStatus;
  client: string;
  employee: string;
};

export type DistributionStatus = keyof typeof PROJECT_STATUSES;
