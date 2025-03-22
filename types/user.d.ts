import { USER_ROLES } from "@/constants";
import { UserRoleEnum } from "@/enums";
import { BaseModel } from "./generics";

export type User = {
  id: string;
  is_active: boolean;
  email: string;
  role: UserRoleEnum;
};

export type Employee = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  user: User;
  profile_image?: string;
};

export type UserRole = keyof typeof USER_ROLES;
