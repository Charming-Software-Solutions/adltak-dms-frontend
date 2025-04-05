import { getCurrentUser } from "@/auth/currentUser";
import { UserRoleEnum } from "@/enums";
import { getEmployees } from "@/lib/actions/employee.actions";
import { getProjects } from "@/lib/actions/project.actions";
import { getTasks } from "@/lib/actions/task.actions";
import TasksClient from "./TasksClient";

export default async function TasksPage() {
  const projects = await getProjects();
  const employee = await getCurrentUser({ withEmployeeProfile: true });
  const allowedRoles = [
    UserRoleEnum.ADMIN,
    UserRoleEnum.PROJECT_MANAGER,
    UserRoleEnum.WAREHOUSE_PERSONNEL,
  ];

  const warehousePersons = employee.user.roles.some((role) =>
    allowedRoles.includes(role),
  )
    ? await getEmployees()
    : [];
  const tasks = await getTasks();

  return (
    <TasksClient
      employee={employee}
      tasks={tasks}
      projects={projects}
      warehousePersons={warehousePersons.filter(
        (person) =>
          person.user.roles.includes(UserRoleEnum.WAREHOUSE_PERSONNEL) &&
          person.user.is_active,
      )}
    />
  );
}
