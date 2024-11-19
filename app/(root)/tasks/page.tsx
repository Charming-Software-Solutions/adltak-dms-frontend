import { getTasks } from "@/lib/actions/task.actions";
import TasksClient from "./TasksClient";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { getSession } from "@/lib/session";

export default async function TasksPage() {
  const tasks = await getTasks();
  const distributions = await getDistributions();
  const user = (await getSession())!.user;

  return (
    <TasksClient user={user} tasks={tasks} distributions={distributions} />
  );
}
