import { getTasks } from "@/lib/actions/task.actions";
import TasksClient from "./TasksClient";
import { getDistributions } from "@/lib/actions/distribution.actions";

export default async function TasksPage() {
  const tasks = await getTasks();
  const distributions = await getDistributions();

  return <TasksClient tasks={tasks} distributions={distributions} />;
}
