import {
  AssetStatusEnum,
  DistributionStatusesEnum,
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

export const ASSET_STATUS: Record<AssetStatusEnum, string> = {
  [AssetStatusEnum.AVAILABLE]: "Available",
  [AssetStatusEnum.IN_USE]: "In Use",
  [AssetStatusEnum.MAINTENANCE]: "Maintenance",
  [AssetStatusEnum.LOST]: "Lost",
} as const;
