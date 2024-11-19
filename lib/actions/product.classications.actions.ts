"use server";

import { Brand, Category, Type } from "@/types/product";
import { fetchAndHandleResponse } from "../utils";
import { domain } from "@/constants";
import { ApiResponse } from "@/types/api";
import { getSession } from "../session";

const BRAND_URL = `${domain}/product/brand/`;
const CATEGORY_URL = `${domain}/product/category/`;
const TYPE_URL = `${domain}/product/type/`;

// Brand actions
async function getBrands(): Promise<Brand[]> {
  const response = await fetchAndHandleResponse<Brand[]>({
    jwt: (await getSession())?.access,
    url: BRAND_URL,
    method: "GET",
  });
  return response.data ?? [];
}

// Category actions
async function getCategories(): Promise<Category[]> {
  const response = await fetchAndHandleResponse<Category[]>({
    jwt: (await getSession())?.access,
    url: CATEGORY_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${CATEGORY_URL}${id}/`,
    method: "GET",
  });
}

// Type actions
async function getTypes(): Promise<Type[]> {
  const response = await fetchAndHandleResponse<Type[]>({
    jwt: (await getSession())?.access,
    url: TYPE_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getTypeById(id: string): Promise<ApiResponse<Category>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: `${TYPE_URL}${id}/`,
    method: "GET",
  });
}

export { getBrands, getCategories, getTypes, getCategoryById, getTypeById };
