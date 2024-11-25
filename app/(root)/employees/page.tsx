import { getEmployees } from "@/lib/actions/employee.actions";
import EmployeeClient from "./EmployeeClient";
import { getAccountSession } from "@/lib/actions/auth.actions";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  const accountSession = await getAccountSession();

  return (
    <EmployeeClient
      employees={employees}
      currentAdmin={accountSession.employee}
    />
  );
}
