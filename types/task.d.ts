import { Employee, User } from "./user";
import { Project, DistributionType } from "./project";
import { TaskStatusImportEnum, TaskStatusExportEnum } from "@/enums";

export type TaskStatus = TaskStatusImportEnum | TaskStatusExportEnum;

export type Task = {
  id: string;
  created_at: string;
  updated_at: string;
  warehouse_person: Employee;
  project: Project;
  status: TaskStatus;
};
