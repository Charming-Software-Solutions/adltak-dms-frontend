"use server";

import { Material, MaterialIssue, MaterialStatus } from "@/types/material";
import { createFilteredUrl, fetchAndHandleResponse } from "../utils";
import { ApiResponse } from "@/types/api";
import { getSession } from "@/auth/session";

const MATERIAL_URL = `${process.env.DOMAIN}/material/`;

type MaterialFilters = {
  brand: string;
  status: string;
  material_type: string;
};

async function createMaterial(body: FormData): Promise<ApiResponse<Material>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: MATERIAL_URL,
    method: "POST",
    body: body,
  });
}

async function getMaterials(filters?: MaterialFilters): Promise<Material[]> {
  const url = createFilteredUrl(filters ?? {}, MATERIAL_URL);

  const response = await fetchAndHandleResponse<Material[]>({
    jwt: (await getSession())?.access,
    url: url,
    method: "GET",
  });
  return response.data ?? [];
}

async function getMaterialById(id: string): Promise<ApiResponse<Material>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${MATERIAL_URL}${id}/`,
    method: "GET",
  });
}

async function updateMaterial(
  id: string,
  body: FormData,
): Promise<ApiResponse<Material>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${MATERIAL_URL}${id}/`,
    method: "PATCH",
    body: body,
  });
}

async function updateMaterialStatus({
  id,
  status,
}: {
  id: string;
  status: MaterialStatus;
}): Promise<ApiResponse<Material>> {
  return fetchAndHandleResponse({
    url: `${MATERIAL_URL}${id}/`,
    jwt: (await getSession())?.access,
    method: "PATCH",
    contentType: "application/json",
    body: JSON.stringify({
      status: status,
    }),
  });
}

async function deleteMaterial(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${MATERIAL_URL}${id}/`,
    method: "DELETE",
  });
}

async function updateMaterialIssue({
  id,
  issues_data,
}: {
  id: string;
  issues_data: Record<string, MaterialIssue>;
}): Promise<ApiResponse<Material>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${MATERIAL_URL}${id}/`,
    method: "PATCH",
    contentType: "application/json",
    body: JSON.stringify({ issues_data }),
  });
}

export {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  updateMaterialStatus,
  deleteMaterial,
  updateMaterialIssue,
};
