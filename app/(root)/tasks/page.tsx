import { UserRoleEnum } from "@/enums";
import { getEmployees } from "@/lib/actions/employee.actions";
import { getTasks } from "@/lib/actions/task.actions";
import TasksClient from "./TasksClient";
import { getCurrentUser } from "@/auth/currentUser";
import { getProjects } from "@/lib/actions/project.actions";

export default async function TasksPage() {
  const projects = await getProjects();
  const employee = await getCurrentUser({ withEmployeeProfile: true });
  const allowedRoles = [UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_MANAGER];

  const warehousePersons = employee.user.roles.some((role) =>
    allowedRoles.includes(role),
  )
    ? await getEmployees()
    : [];
  const tasks = await getTasks(employee.user.id, employee.user.roles);

  return (
    <TasksClient
      employee={employee}
      tasks={tasks}
      projects={projects}
      warehousePersons={warehousePersons}
    />
  );
}
