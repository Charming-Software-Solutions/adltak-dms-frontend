import {
  MaterialStatusEnum,
  ProjectStatusEnum,
  UserRoleEnum,
  TaskStatusEnum,
  IncomingProductsStatus,
  MaterialIssueEnum,
} from "@/enums";
import { SelectItemType } from "@/types/primitives";

export const imagePlaceholder = "/assets/images/placeholder.svg";
export const domain = process.env.DOMAIN;
export const userRoles: SelectItemType[] = [
  {
    label: "Project Handler",
    value: "project_handler",
  },
  {
    label: "Logistics Specialist",
    value: "logistics_specialist",
  },
  {
    label: "Warehouse Worker",
    value: "warehouse_worker",
  },
];
export const distributionTypes: SelectItemType[] = [
  {
    label: "Incoming",
    value: "IMPORT",
  },
  {
    label: "Outgoing",
    value: "EXPORT",
  },
];
export const productStockStatuses: SelectItemType[] = [
  {
    label: "Out of Quantity",
    value: "OUT_OF_STOCK",
  },
  {
    label: "Low Quantity",
    value: "LOW_STOCK",
  },
  {
    label: "In Quantity",
    value: "IN_STOCK",
  },
];
export const productMonthExpirationFreq: SelectItemType[] = [
  {
    label: "3 months from now",
    value: "3",
  },
  {
    label: "6 months from now",
    value: "6",
  },
  {
    label: "12 months from now",
    value: "12",
  },
];

export const PROJECT_STATUSES: Record<ProjectStatusEnum, string> = {
  [ProjectStatusEnum.AWAITING_PWP]: "Awaiting PWP",
  [ProjectStatusEnum.CONCLUDED]: "Concluded",
  [ProjectStatusEnum.LOCKED]: "Locked",
  [ProjectStatusEnum.DISCUSSED]: "Discussed",
  [ProjectStatusEnum.FOR_IMPLEMENTATION]: "For Implementation",
  [ProjectStatusEnum.ONGOING]: "Ongoing",
  [ProjectStatusEnum.CANCELLED]: "Cancelled",
} as const;

export const MATERIAL_STATUS: Record<MaterialStatusEnum, string> = {
  [MaterialStatusEnum.AVAILABLE]: "Available",
  [MaterialStatusEnum.IN_USE]: "In Use",
  [MaterialStatusEnum.UNAVAILABLE]: "Unavailable",
} as const;

export const MATERIAL_ISSUE: Record<MaterialIssueEnum, string> = {
  [MaterialIssueEnum.DAMAGED]: "Damaged",
  [MaterialIssueEnum.FOR_REPAIR]: "For Repair",
  [MaterialIssueEnum.LOST]: "Lost",
} as const;

export const USER_ROLES: Record<UserRoleEnum, string> = {
  [UserRoleEnum.ADMIN]: "Admin",
  [UserRoleEnum.WAREHOUSE_PERSONNEL]: "Warehouse Personnel",
  [UserRoleEnum.LOGISTICS_TEAM_MEMBER]: "Logistics Team Member",
  [UserRoleEnum.PROJECT_MANAGER]: "Project Manager",
} as const;

export const TASK_STATUS: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.PENDING]: "Pending",
  [TaskStatusEnum.DELIVERED]: "Delivered",
} as const;

export const INCOMING_PRODUCTS_STATUS: Record<IncomingProductsStatus, string> =
  {
    [IncomingProductsStatus.PENDING]: "Pending",
    [IncomingProductsStatus.RECEIVED]: "Received",
  } as const;
