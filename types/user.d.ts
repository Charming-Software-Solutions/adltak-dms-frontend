import { USER_ROLES } from "@/constants";
import { UserRoleEnum } from "@/enums";
import { BaseModel } from "./generics";

export type User = {
  id: string;
  email: string;
  role: UserRoleEnum;
};

export type UserSession = {
  id: string;
  role: UserRoleEnum;
};

export type UserLogin = {
  refresh: string;
  access: string;
  user: {
    id: string;
    role: UserRoleEnum;
  };
  employee: {
    id: string;
    name: string;
    profile_image?: string;
  };
};

export type Employee = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  user: User;
  profile_image?: string;
};

export type EmployeeSession = {
  name: string;
  profile_image?: string;
};

export type EmployeeLogin = {
  name: string | undefined;
  profile_image?: string | undefined;
};

export type AccountSession = {
  employee: Employee;
  refresh: string;
};

export type UserRole = keyof typeof USER_ROLES;
