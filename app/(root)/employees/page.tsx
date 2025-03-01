import { getEmployees } from "@/lib/actions/employee.actions";
import EmployeeClient from "./EmployeeClient";
import { getCurrentUser } from "@/auth/currentUser";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  const employee = await getCurrentUser({ withEmployeeProfile: true });

  return <EmployeeClient employees={employees} currentAdmin={employee} />;
}
