import { getEmployees } from "@/lib/actions/employee.actions";
import EmployeeClient from "./EmployeeClient";
import { getCurrentUser } from "@/auth/currentUser";
import { Suspense } from "react";
import LoadingSpinnerIcon from "@/components/ui/loading-spinner";

async function EmployeesServer() {
  const employees = await getEmployees();
  const employee = await getCurrentUser({ withEmployeeProfile: true });

  return <EmployeeClient employees={employees} currentAdmin={employee} />;
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<LoadingSpinnerIcon />}>
      <EmployeesServer />
    </Suspense>
  );
}
