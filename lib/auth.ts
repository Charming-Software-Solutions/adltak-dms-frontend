import { UserRoleEnum } from "@/enums";

export const hasPermission = (
  role: UserRoleEnum,
  allowedRoles: UserRoleEnum[],
) => {
  return allowedRoles.includes(role);
};
