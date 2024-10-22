"use server";

import { ICreateUser } from "@/interfaces";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "../auth";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

const USER_URL = `${process.env.DOMAIN}/user/`;

async function createUser(body: ICreateUser): Promise<ApiResponse<User>> {
  return fetchAndHandleResponse({
    url: USER_URL,
    contentType: "application/json",
    jwt: (await getSession()).access,
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

export { createUser, getUsers };
