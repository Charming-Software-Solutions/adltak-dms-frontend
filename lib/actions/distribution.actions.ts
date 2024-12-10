"use server";

import { ICreateDistribution } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { Distribution, DistributionProduct } from "@/types/distribution";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "../session";

const DISTRIBUTION_URL = `${process.env.DOMAIN}/distribution/`;

async function createDistribution(
  body: ICreateDistribution,
): Promise<ApiResponse<Distribution>> {
  return fetchAndHandleResponse({
    jwt: (await getSession())?.access,
    url: DISTRIBUTION_URL,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function getDistributions(): Promise<Distribution[]> {
  const response = await fetchAndHandleResponse<Distribution[]>({
    jwt: (await getSession())?.access,
    url: DISTRIBUTION_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function getDistributionProducts(): Promise<DistributionProduct[]> {
  const response = await fetchAndHandleResponse<DistributionProduct[]>({
    jwt: (await getSession())?.access,
    url: `${DISTRIBUTION_URL}get-distribution-products/`,
    method: "GET",
  });
  return response.data ?? [];
}

async function updateDistribution(
  id: string,
  body: FormData,
): Promise<ApiResponse<Distribution>> {
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
