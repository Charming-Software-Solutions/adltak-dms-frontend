"use server";

import { ApiResponse } from "@/types/api";
import { Task } from "@/types/task";
import { fetchAndHandleResponse } from "../utils";
import { GenericStatusEnum, UserRoleEnum } from "@/enums";
import { getSession } from "@/auth/session";

const TASK_URL = `${process.env.DOMAIN}/task/`;

async function createTask(body: FormData): Promise<ApiResponse<Task>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: TASK_URL,
    method: "POST",
    body: body,
  });
}

async function getTasks(
  userId?: string,
  roles?: UserRoleEnum[],
): Promise<Task[]> {
  let params = "";

  if (userId && roles && roles.includes(UserRoleEnum.WAREHOUSE_PERSONNEL)) {
    params = `?user_id=${userId}`;
  }

  const response = await fetchAndHandleResponse<Task[]>({
    jwt: (await getSession())?.access,
    url: `${TASK_URL}${params}`,
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
  status: GenericStatusEnum;
}): Promise<ApiResponse<Task>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
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
    jwt: (await getSession())?.access,
    url: `${TASK_URL}${id}/`,
    method: "DELETE",
  });
}

export { createTask, deleteTask, getTasks, updateTask, updateTaskStatus };
