export enum UserRoleEnum {
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
