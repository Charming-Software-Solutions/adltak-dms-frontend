export enum UserRoleEnum {
  AMDMIN = "admin",
  LOGISTICS = "logistics_specialist",
  WAREHOUSE = "warehouse_worker",
  PROJECT = "project_handler",
}

export enum TaskStatusImportEnum {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
  CHECKED_IN = "CHECKED_IN",
  STOCKED = "STOCKED",
  SHELVED = "SHELVED",
}

export enum TaskStatusExportEnum {
  PICKED = "PICKED",
  PACKED = "PACKED",
  LOADED = "LOADED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
}

export enum AssetStatusEnum {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
  LOST = "LOST",
}

export enum AssetConditionEnum {
  NEW = "NEW",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  DAMAGED = "DAMAGED",
}
