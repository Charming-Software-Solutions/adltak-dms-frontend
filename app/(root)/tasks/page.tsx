import TasksClient from "./TasksClient";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { getSession } from "@/lib/session";
import { UserRoleEnum } from "@/enums";
import { getEmployees } from "@/lib/actions/employee.actions";
import { getTasks } from "@/lib/actions/task.actions";

export default async function TasksPage() {
  const distributions = await getDistributions();
  const user = (await getSession())!.user;
  const warehousePersons =
    user.role === UserRoleEnum.ADMIN ||
    user.role === UserRoleEnum.PROJECT_HANDLER
      ? await getEmployees()
      : [];
  const tasks = await getTasks(user.id, user.role);

  return (
    <TasksClient
      user={user}
      tasks={tasks}
      distributions={distributions}
      warehousePersons={warehousePersons}
    />
  );
}
