"use server";

import { Task, TaskStatus } from "@/types/task";
import { fetchAndHandleResponse } from "../utils";
import { ApiResponse } from "@/types/api";
import { ICreateTask } from "@/interfaces";

const TASK_URL = `${process.env.DOMAIN}/task/`;

async function createTask(body: ICreateTask): Promise<ApiResponse<Task>> {
  return fetchAndHandleResponse({
    url: TASK_URL,
    contentType: "application/json",
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function getTasks(): Promise<Task[]> {
  const response = await fetchAndHandleResponse<Task[]>({
    url: TASK_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function updateTaskStatus({
  id,
  status,
}: {
  id: string;
  status: TaskStatus;
}): Promise<ApiResponse<Task>> {
  return fetchAndHandleResponse({
    url: `${TASK_URL}${id}/`,
    contentType: "application/json",
    method: "PATCH",
    body: JSON.stringify({
      status: status,
    }),
  });
}

async function deleteTask(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    url: `${TASK_URL}${id}/`,
    method: "DELETE",
  });
}

export { createTask, getTasks, updateTaskStatus, deleteTask };
