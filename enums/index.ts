export enum UserRoleEnum {
  AMDMIN = "admin",
  LOGISTICS = "logistics_specialist",
  WAREHOUSE = "warehouse_worker",
  PROJECT = "project_handler",
}

export enum ProductStockStatusesEnum {
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LOW_STOCK = "LOW_STOCK",
  IN_STOCK = "IN_STOCK",
}

export enum DistributionStatusesEnum {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  SCHEDULED = "SCHEDULED",
}

export enum TaskStatusImportEnum {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
  CHECKED_IN = "CHECKED_IN",
  STOCKED = "STOCKED",
  SHELVED = "SHELVED",
}

export enum TaskStatusExportEnum {
  PENDING = "PENDING",
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
