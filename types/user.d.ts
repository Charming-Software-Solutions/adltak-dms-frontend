import { UserRoleEnum } from "@/enums";

export type User = {
  id: string;
  id: string;
  email: string;
  role: UserRoleEnum;
};

export type UserLogin = {
  refresh: string;
  access: string;
  user: User;
};

export type UserRoleBooleans = {
  is_staff: boolean;
  is_warehouse: boolean;
  is_project: boolean;
  is_logistics: boolean;
};

export type Employee = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  user: User;
};
