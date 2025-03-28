"use server";

import { ICreateProject } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { Project, ProjectProduct } from "@/types/project";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";

const PROJECT_URL = `${process.env.DOMAIN}/project/`;

async function createProject(
  body: ICreateProject,
): Promise<ApiResponse<Project>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: PROJECT_URL,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function getProjects(): Promise<Project[]> {
  const response = await fetchAndHandleResponse<Project[]>({
    jwt: (await getSession())?.access,
    url: PROJECT_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getProjectProducts(): Promise<ProjectProduct[]> {
  const response = await fetchAndHandleResponse<ProjectProduct[]>({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}get-projcet-products/`,
    method: "GET",
  });
  return response.data ?? [];
}

async function updateProject(
  id: string,
  body: FormData,
): Promise<ApiResponse<Project>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}${id}/`,
    method: "PATCH",
    body: body,
  });
}

async function deleteProject(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}${id}/`,
    method: "DELETE",
  });
}

export {
  createProject,
  getProjects,
  getProjectProducts,
  updateProject,
  deleteProject,
};
