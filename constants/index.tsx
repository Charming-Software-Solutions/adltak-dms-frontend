import {
  AssetStatusEnum,
  ProjectStatusEnum,
  UserRoleEnum,
  TaskStatusExportEnum,
  TaskStatusImportEnum,
  DistributionTypeEnum,
  GenericStatusEnum,
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
  [ProjectStatusEnum.DISCUSSED]: "Discussed",
  [ProjectStatusEnum.FOR_IMPLEMENTATION]: "For Implementation",
  [ProjectStatusEnum.ONGOING]: "Ongoing",
  [ProjectStatusEnum.CANCELLED]: "Cancelled",
} as const;

export const TASK_STATUS_IMPORT: Record<TaskStatusImportEnum, string> = {
  [TaskStatusImportEnum.PENDING]: "Pending",
  [TaskStatusImportEnum.RECEIVED]: "Received",
  [TaskStatusImportEnum.CHECKED_IN]: "Checked In",
  [TaskStatusImportEnum.STOCKED]: "Stocked",
  [TaskStatusImportEnum.SHELVED]: "Shelved",
};

// TaskStatusExportEnum labels
export const TASK_STATUS_EXPORT: Record<TaskStatusExportEnum, string> = {
  [TaskStatusImportEnum.PENDING]: "Pending",
  [TaskStatusExportEnum.PICKED]: "Picked",
  [TaskStatusExportEnum.PACKED]: "Packed",
  [TaskStatusExportEnum.LOADED]: "Loaded",
  [TaskStatusExportEnum.SHIPPED]: "Shipped",
  [TaskStatusExportEnum.DELIVERED]: "Delivered",
};

export const TASK_STATUS: Record<string, string> = {
  ...TASK_STATUS_IMPORT,
  ...TASK_STATUS_EXPORT,
};

export const COMBINED_TASK_STATUS: SelectItemType[] = [
  ...Object.entries(TASK_STATUS_IMPORT).map(([key, label]) => ({
    label,
    value: key,
  })),
  ...Object.entries(TASK_STATUS_EXPORT).map(([key, label]) => ({
    label,
    value: key,
  })),
].filter(
  (item, index, self) =>
    index === self.findIndex((t) => t.value === item.value),
);

export const ASSET_STATUS: Record<AssetStatusEnum, string> = {
  [AssetStatusEnum.AVAILABLE]: "Available",
  [AssetStatusEnum.IN_USE]: "In Use",
  [AssetStatusEnum.MAINTENANCE]: "Maintenance",
  [AssetStatusEnum.LOST]: "Lost",
} as const;

export const USER_ROLES: Record<UserRoleEnum, string> = {
  [UserRoleEnum.ADMIN]: "Admin",
  [UserRoleEnum.WAREHOUSE_PERSONNEL]: "Warehouse Personnel",
  [UserRoleEnum.LOGISTICS_TEAM_MEMBER]: "Logistics Team Member",
  [UserRoleEnum.PROJECT_MANAGER]: "Project Manager",
} as const;

export const GENERIC_STATUS: Record<GenericStatusEnum, string> = {
  [GenericStatusEnum.PENDING]: "Pending",
  [GenericStatusEnum.DELIVERED]: "Delivered",
} as const;
