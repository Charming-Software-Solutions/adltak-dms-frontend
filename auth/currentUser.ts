import { redirect } from "next/navigation";
import { cache } from "react";
import { getEmployeeProfile } from "@/lib/actions/employee.actions";
import { Employee, User } from "@/types/user";
import { getSession } from "./session";

function _getCurrentUser(options: {
  withEmployeeProfile: true;
}): Promise<Employee>;
function _getCurrentUser(options?: {
  withEmployeeProfile?: false;
}): Promise<User | null>;

async function _getCurrentUser({
  withEmployeeProfile = false,
}: { withEmployeeProfile?: boolean } = {}): Promise<Employee | User | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  // NOTE: withEmployeeProfile returns the entire employee object,
  // which also contains the entire user object

  if (withEmployeeProfile) {
    const fullEmployee = await getEmployeeProfile();
    return fullEmployee.data as Employee;
  } else {
    return session.user;
  }
}

// Cache the getCurrentUser function to only refetch the data
// if changed
export const getCurrentUser = cache(_getCurrentUser);
