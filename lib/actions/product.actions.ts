"use server";

import { ApiResponse } from "@/types/api";
import { Product } from "@/types/product";
import { fetchAndHandleResponse } from "../utils";

const PRODUCT_URL = `${process.env.DOMAIN}/product/`;

async function createProduct(body: FormData): Promise<ApiResponse<Product>> {
  return fetchAndHandleResponse({
    url: PRODUCT_URL,
    method: "POST",
    body: body,
  });
}

async function getProducts(): Promise<Product[]> {
  const response = await fetchAndHandleResponse<Product[]>({
    url: PRODUCT_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getProductById(id: string): Promise<ApiResponse<Product>> {
  return fetchAndHandleResponse({
    url: `${PRODUCT_URL}${id}/`,
    method: "GET",
  });
}

async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ApiResponse<Product>> {
  return fetchAndHandleResponse({
    url: `${PRODUCT_URL}${id}/`,
    method: "PATCH",
    body: formData,
  });
}

async function deleteProduct(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    url: `${PRODUCT_URL}${id}/`,
    method: "DELETE",
  });
}

export {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
};
