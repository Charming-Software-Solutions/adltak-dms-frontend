import { UserRoleEnum } from "@/enums";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { getEmployees } from "@/lib/actions/employee.actions";
import { getTasks } from "@/lib/actions/task.actions";
import TasksClient from "./TasksClient";
import { getCurrentUser } from "@/auth/currentUser";

export default async function TasksPage() {
  const distributions = await getDistributions();
  const employee = await getCurrentUser({ withEmployeeProfile: true });
  const warehousePersons =
    employee.user.role === UserRoleEnum.ADMIN ||
    employee.user.role === UserRoleEnum.PROJECT_HANDLER
      ? await getEmployees()
      : [];
  const tasks = await getTasks(employee.user.id, employee.user.role);

  return (
    <TasksClient
      employee={employee}
      tasks={tasks}
      distributions={distributions}
      warehousePersons={warehousePersons}
    />
  );
}
