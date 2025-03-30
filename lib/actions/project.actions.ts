"use server";

import { ICreateProject } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { Project, ProjectProduct } from "@/types/project";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";
import { IncomingProductsStatus, ProjectStatusEnum } from "@/enums";
import { formatErrorResponse } from "../formatters";

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

async function getProjectById(id: string): Promise<ApiResponse<Project>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}${id}/`,
    method: "GET",
  });
}

async function getProjectsByProduct(productName: string): Promise<Project[]> {
  const response = await fetchAndHandleResponse<Project[]>({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}projects-by-product/?product=${productName}`,
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

async function updateProjectIncomingProductsStatus({
  id,
  status,
}: {
  id: string;
  status: IncomingProductsStatus;
}): Promise<ApiResponse<Project>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}${id}/update-incoming-status/`,
    contentType: "application/json",
    method: "PATCH",
    body: JSON.stringify({
      incoming_products_status: status,
    }),
  });
}

async function updateProjectStatus({
  id,
  status,
}: {
  id: string;
  status: ProjectStatusEnum;
}): Promise<ApiResponse<Project>> {
  const response = await fetchAndHandleResponse<Project>({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}${id}/update-status/`,
    contentType: "application/json",
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  console.log(status);

  if (response.errors) {
    throw new Error(formatErrorResponse(response.errors));
  }
  return response;
}

async function deleteProject(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}${id}/`,
    method: "DELETE",
  });
}

// Project product related actions

async function updateProjectProductQuantity({
  id,
  quantity,
  isUsedQuantity = false,
}: {
  id: string;
  quantity: number;
  isUsedQuantity?: boolean;
}): Promise<ApiResponse<ProjectProduct>> {
  const fieldToUpdate = isUsedQuantity ? "used_quantity" : "quantity";

  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}product/${id}/`,
    contentType: "application/json",
    method: "PATCH",
    body: JSON.stringify({
      [fieldToUpdate]: quantity,
    }),
  });
}

async function getProjectProductById(
  id: string,
): Promise<ApiResponse<ProjectProduct>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}product/${id}/`,
    method: "GET",
  });
}

async function getProjectProducts(): Promise<ProjectProduct[]> {
  const response = await fetchAndHandleResponse<ProjectProduct[]>({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}get-project-products/`,
    method: "GET",
  });
  return response.data ?? [];
}

export {
  createProject,
  getProjects,
  getProjectsByProduct,
  getProjectById,
  updateProject,
  updateProjectIncomingProductsStatus,
  updateProjectStatus,
  deleteProject,
  // Project product actions
  getProjectProducts,
  getProjectProductById,
  updateProjectProductQuantity,
};
