import {
  TaskStatusEnum,
  ProjectStatusEnum,
  IncomingProductsStatus,
} from "@/enums";
import { Product } from "./product";
import { Employee } from "./user";
import { PROJECT_STATUSES } from "@/constants";
import { BaseModel } from "./generics";
import { Material } from "./material";

export type ProjectProduct = BaseModel & {
  product: Product;
  quantity: number;
  expiration: string;
  used_quantity: number;
  remaining_quantity: number;
  ba_reference_number: string;
};

export type ProjectMaterial = BaseModel & {
  material: Material;
  material_name: string;
  material_type: string;
  quantity: number;
  used_quantity: number;
};

export type Project = BaseModel & {
  products: ProjectProduct[];
  materials: ProjectMaterial[];
  name: string;
  ba_reference_number: string;
  status: ProjectStatusEnum;
  incoming_products_status: IncomingProductsStatus;
  client: string;
  employee: string;
};

export type ProjectStatus = keyof typeof PROJECT_STATUSES;
