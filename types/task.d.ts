import { Employee, User } from "./user";
import { Distribution, DistributionType } from "./distribution";
import { TaskStatusImportEnum, TaskStatusExportEnum } from "@/enums";

export type TaskStatus = TaskStatusImportEnum | TaskStatusExportEnum;

export type Task = {
  id: string;
  created_at: string;
  updated_at: string;
  warehouse_person: {
    user: User;
    id: string;
    name: string;
  };
  distribution: Distribution;
  status: TaskStatus;
};
