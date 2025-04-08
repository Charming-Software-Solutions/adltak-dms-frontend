export enum UserRoleEnum {
  ADMIN = "admin",
  WAREHOUSE_PERSONNEL = "warehouse_personnel",
  LOGISTICS_TEAM_MEMBER = "logistics_team_member",
  PROJECT_MANAGER = "project_manager",
}

export enum ProductStockStatusesEnum {
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LOW_STOCK = "LOW_STOCK",
  IN_STOCK = "IN_STOCK",
}

export enum ProjectStatusEnum {
  AWAITING_PWP = "AWAITING_PWP",
  CONCLUDED = "CONCLUDED",
  LOCKED = "LOCKED",
  DISCUSSED = "DISCUSSED",
  FOR_IMPLEMENTATION = "FOR_IMPLEMENTATION",
  ONGOING = "ONGOING",
  CANCELLED = "CANCELLED",
}

export enum AssetStatusEnum {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  DAMAGED = "DAMAGED",
  FOR_REPAIR = "FOR_REPAIR",
  LOST = "LOST",
}

export enum AssetConditionEnum {
  NEW = "NEW",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  DAMAGED = "DAMAGED",
}

export enum FormModeEnum {
  CREATE = "CREATE",
  EDIT = "EDIT",
}

export enum DistributionTypeEnum {
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
}

export enum TaskStatusEnum {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
}

export enum IncomingProductsStatus {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
}

export enum ItemTypeEnum {
  PRODUCT = "PRODUCT",
  ASSET = "ASSET",
}
