"use server";

import { ApiResponse } from "@/types/api";
import { Classification, ClassificationType } from "@/types/generics";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "../session";

function getClassificationUrl(classificationType: ClassificationType): string {
  let url = `${process.env.DOMAIN}`;

  switch (classificationType) {
    case "product_brand":
      url = `${url}/product/brand/`;
      break;
    case "product_category":
      url = `${url}/product/category/`;
      break;
    case "product_type":
      url = `${url}/product/type/`;
      break;
    case "asset_type":
      url = `${url}/asset/type/`;
    default:
      break;
  }

  return url;
}

async function createClassification(
  body: FormData,
  classificationType: ClassificationType,
): Promise<ApiResponse<Classification>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: getClassificationUrl(classificationType),
    method: "POST",
    body: body,
  });
}

async function getClassifications(
  classificationType: ClassificationType,
): Promise<Classification[]> {
  const response = await fetchAndHandleResponse<Classification[]>({
    jwt: (await getSession())?.access,
    url: getClassificationUrl(classificationType),
    method: "GET",
  });

  return response.data ?? [];
}

async function updateClassification(
  id: string,
  body: FormData,
  classificationType: ClassificationType,
): Promise<ApiResponse<Classification>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${getClassificationUrl(classificationType)}${id}/`,
    method: "PATCH",
    body: body,
  });
}

async function deleteClassification(
  id: string,
  classificationType: ClassificationType,
): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${getClassificationUrl(classificationType)}${id}/`,
    method: "DELETE",
  });
}

export {
  createClassification,
  getClassifications,
  updateClassification,
  deleteClassification,
};
