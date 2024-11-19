import { getEmployees } from "@/lib/actions/employee.actions";
import EmployeeClient from "./EmployeeClient";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return <EmployeeClient employees={employees} />;
}
