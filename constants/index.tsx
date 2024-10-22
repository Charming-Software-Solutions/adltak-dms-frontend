import { TaskStatusExportEnum, TaskStatusImportEnum } from "@/enums";
import { DistributionStatus } from "@/types/distribution";
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
export const DistributionStatuses: DistributionStatus[] = [
  "Pending",
  "In Transit",
  "Delivered",
  "Cancelled",
  "Returned",
  "On Hold",
  "Completed",
  "Failed",
  "Scheduled",
];

export const TASK_STATUS_IMPORT: Record<TaskStatusImportEnum, string> = {
  [TaskStatusImportEnum.PENDING]: "Pending",
  [TaskStatusImportEnum.RECEIVED]: "Received",
  [TaskStatusImportEnum.CHECKED_IN]: "Checked In",
  [TaskStatusImportEnum.STOCKED]: "Stocked",
  [TaskStatusImportEnum.SHELVED]: "Shelved",
};

// TaskStatusExportEnum labels
export const TASK_STATUS_EXPORT: Record<TaskStatusExportEnum, string> = {
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
