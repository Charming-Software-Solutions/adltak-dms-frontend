"use server";

import { ICreateUser } from "@/interfaces";
import { fetchAndHandleResponse } from "../utils";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { getSession } from "../session";

const USER_URL = `${process.env.DOMAIN}/user/`;

async function createUser(body: ICreateUser): Promise<ApiResponse<User>> {
  return fetchAndHandleResponse({
    url: USER_URL,
    contentType: "application/json",
    jwt: (await getSession())?.access,
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function getUsers(): Promise<User[]> {
  const response = await fetchAndHandleResponse<User[]>({
    url: USER_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getUserById(
  id: string,
  access: string,
): Promise<ApiResponse<User>> {
  return await fetchAndHandleResponse({
    url: `${USER_URL}${id}`,
    jwt: access,
    method: "GET",
  });
}

export { createUser, getUsers, getUserById };
