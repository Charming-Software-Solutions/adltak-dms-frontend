import { UserRoleEnum } from "@/enums";

export type User = {
  id: string;
  last_login: null;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  role: UserRoleEnum;
  groups: any[];
  user_permissions: any[];
  refresh: string;
  access: string;
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
