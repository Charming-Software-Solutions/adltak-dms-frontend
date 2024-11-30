import { UserRoleEnum } from "@/enums";
import { getAccountSession } from "@/lib/actions/auth.actions";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { getEmployees } from "@/lib/actions/employee.actions";
import { getTasks } from "@/lib/actions/task.actions";
import TasksClient from "./TasksClient";

export default async function TasksPage() {
  const distributions = await getDistributions();
  const employee = (await getAccountSession()).employee;
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
