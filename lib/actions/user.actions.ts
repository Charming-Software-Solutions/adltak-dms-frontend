"use server";

import { fetchAndHandleResponse } from "../utils";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { getSession } from "../session";

const USER_URL = `${process.env.DOMAIN}/user/`;

async function createUser(formData: FormData): Promise<ApiResponse<User>> {
  return fetchAndHandleResponse({
    url: USER_URL,
    jwt: (await getSession())?.access,
    method: "POST",
    body: formData,
  });
}

async function updateUser(
  id: string,
  formData: FormData,
): Promise<ApiResponse<User>> {
  return fetchAndHandleResponse({
    url: `${USER_URL}${id}/`,
    jwt: (await getSession())?.access,
    method: "PUT",
    body: formData,
  });
}

async function getUsers(): Promise<User[]> {
  const response = await fetchAndHandleResponse<User[]>({
    url: USER_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getUserById(id: string): Promise<ApiResponse<User>> {
  return await fetchAndHandleResponse({
    url: `${USER_URL}${id}`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
}

export { createUser, updateUser, getUsers, getUserById };
