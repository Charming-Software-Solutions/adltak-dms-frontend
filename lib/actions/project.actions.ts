"use server";

import { ICreateProject } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { Project, ProjectMaterial, ProjectProduct } from "@/types/project";
import { createFilteredUrl, fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";
import {
  IncomingProductsStatus,
  ItemTypeEnum,
  ProjectStatusEnum,
} from "@/enums";
import { formatErrorResponse } from "../formatters";
import { ProjectItem } from "../store";

const PROJECT_URL = `${process.env.DOMAIN}/project/`;

type ProjectFilters = {
  status: string;
  start_date: Date | null;
  end_date: Date | null;
};

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

async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  const url = createFilteredUrl(filters ?? {}, PROJECT_URL);

  const response = await fetchAndHandleResponse<Project[]>({
    jwt: (await getSession())?.access,
    url: url,
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

async function getProjectByMaterial(
  materialName: string,
): Promise<ApiResponse<Project>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${PROJECT_URL}project-by-material/?material=${materialName}`,
    method: "GET",
  });
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

// Project item related actions

async function updateProjectItemQuantity({
  id,
  itemType,
  quantity,
  isUsedQuantity = false,
}: {
  id: string;
  itemType: ItemTypeEnum;
  quantity: number;
  isUsedQuantity?: boolean;
}): Promise<ApiResponse<ProjectItem>> {
  const fieldToUpdate = isUsedQuantity ? "used_quantity" : "quantity";
  const url =
    itemType === ItemTypeEnum.PRODUCT
      ? `${PROJECT_URL}product/${id}/`
      : `${PROJECT_URL}material/${id}/`;

  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: url,
    contentType: "application/json",
    method: "PATCH",
    body: JSON.stringify({
      [fieldToUpdate]: quantity,
    }),
  });
}

async function getProjectItemById(
  id: string,
  itemType: ItemTypeEnum,
): Promise<ApiResponse<ProjectItem>> {
  const url =
    itemType === ItemTypeEnum.PRODUCT
      ? `${PROJECT_URL}product/${id}/`
      : `${PROJECT_URL}material/${id}/`;

  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: url,
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
  getProjectByMaterial,
  getProjectById,
  updateProject,
  updateProjectIncomingProductsStatus,
  updateProjectStatus,
  deleteProject,
  // Project item actions
  getProjectProducts,
  getProjectItemById,
  updateProjectItemQuantity,
};
