"use server";

import { getSession } from "@/auth/session";
import { TaskStatusEnum } from "@/enums";
import { ApiResponse } from "@/types/api";
import { Task } from "@/types/task";
import {
  createFilteredUrl,
  fetchAndHandleResponse,
  toManilaISOString,
} from "../utils";

const TASK_URL = `${process.env.DOMAIN}/task/`;

type TaskFilter = {
  status: string;
  start_date: Date | string | null;
  end_date: Date | string | null;
};

async function createTask(body: FormData): Promise<ApiResponse<Task>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: TASK_URL,
    method: "POST",
    body: body,
  });
}

async function getTasks(filters?: TaskFilter): Promise<Task[]> {
  const normalizedFilters = { ...filters };

  if (normalizedFilters.start_date instanceof Date) {
    normalizedFilters.start_date = toManilaISOString(
      normalizedFilters.start_date,
    );
  }
  if (normalizedFilters.end_date instanceof Date) {
    normalizedFilters.end_date = toManilaISOString(normalizedFilters.end_date);
  }

  const url = createFilteredUrl(normalizedFilters, TASK_URL);

  const response = await fetchAndHandleResponse<Task[]>({
    jwt: (await getSession())?.access,
    url: url,
    method: "GET",
  });

  return response.data ?? [];
}

async function updateTask(
  id: string,
  body: FormData,
): Promise<ApiResponse<Task>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${TASK_URL}${id}/`,
    method: "PATCH",
    body: body,
  });
}

async function updateTaskStatus({
  id,
  status,
}: {
  id: string;
  status: TaskStatusEnum;
}): Promise<ApiResponse<Task>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${TASK_URL}${id}/update-status/`,
    contentType: "application/json",
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

async function deleteTask(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${TASK_URL}${id}/`,
    method: "DELETE",
  });
}

export { createTask, deleteTask, getTasks, updateTask, updateTaskStatus };
