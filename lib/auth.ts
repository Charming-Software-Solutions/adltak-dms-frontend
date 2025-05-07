import { UserRoleEnum } from "@/enums";

export const hasPermission = (
  userRoles: UserRoleEnum[],
  allowedRoles: UserRoleEnum[],
) => {
  return userRoles.some((role) => allowedRoles.includes(role));
};
