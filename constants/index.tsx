import {
  AssetStatusEnum,
  DistributionStatusesEnum,
  UserRoleEnum,
  TaskStatusExportEnum,
  TaskStatusImportEnum,
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
    label: "Import",
    value: "IMPORT",
  },
  {
    label: "Export",
    value: "EXPORT",
  },
];
export const productStockStatuses: SelectItemType[] = [
  {
    label: "Out of Stock",
    value: "OUT_OF_STOCK",
  },
  {
    label: "Low Stock",
    value: "LOW_STOCK",
  },
  {
    label: "In Stock",
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

export const DISTRIBUTION_STATUSES: Record<DistributionStatusesEnum, string> = {
  [DistributionStatusesEnum.PENDING]: "Pending",
  [DistributionStatusesEnum.IN_TRANSIT]: "In Transit",
  [DistributionStatusesEnum.DELIVERED]: "Delivered",
  [DistributionStatusesEnum.CANCELLED]: "Cancelled",
  [DistributionStatusesEnum.RETURNED]: "Returned",
  [DistributionStatusesEnum.ON_HOLD]: "On Hold",
  [DistributionStatusesEnum.COMPLETED]: "Completed",
  [DistributionStatusesEnum.FAILED]: "Failed",
  [DistributionStatusesEnum.SCHEDULED]: "Scheduled",
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
  [UserRoleEnum.LOGISTICS_SPECIALIST]: "Logistics Team Member",
  [UserRoleEnum.WAREHOUSE_WORKER]: "Warehouse Personnel",
  [UserRoleEnum.PROJECT_HANDLER]: "Project Manager",
} as const;
