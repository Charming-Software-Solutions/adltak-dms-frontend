"use server";

import { ICreateProject } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { Project, ProjectProduct } from "@/types/project";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";

const DISTRIBUTION_URL = `${process.env.DOMAIN}/distribution/`;

async function createDistribution(
  body: ICreateProject,
): Promise<ApiResponse<Project>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: DISTRIBUTION_URL,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function getDistributions(): Promise<Project[]> {
  const response = await fetchAndHandleResponse<Project[]>({
    jwt: (await getSession())?.access,
    url: DISTRIBUTION_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getDistributionProducts(): Promise<ProjectProduct[]> {
  const response = await fetchAndHandleResponse<ProjectProduct[]>({
    jwt: (await getSession())?.access,
    url: `${DISTRIBUTION_URL}get-distribution-products/`,
    method: "GET",
  });
  return response.data ?? [];
}

async function updateDistribution(
  id: string,
  body: FormData,
): Promise<ApiResponse<Project>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${DISTRIBUTION_URL}${id}/`,
    method: "PATCH",
    body: body,
  });
}

async function deleteDistribution(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${DISTRIBUTION_URL}${id}/`,
    method: "DELETE",
  });
}

export {
  createDistribution,
  getDistributions,
  getDistributionProducts,
  updateDistribution,
  deleteDistribution,
};
