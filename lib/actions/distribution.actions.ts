"use server";

import { ICreateDistribution } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { Distribution } from "@/types/distribution";
import { fetchAndHandleResponse } from "../utils";

const DISTRIBUTION_URL = `${process.env.DOMAIN}/distribution/`;

async function createDistribution(
  body: ICreateDistribution,
): Promise<ApiResponse<Distribution>> {
  return fetchAndHandleResponse({
    url: DISTRIBUTION_URL,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function getDistributions(): Promise<Distribution[]> {
  const response = await fetchAndHandleResponse<Distribution[]>({
    url: DISTRIBUTION_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function deleteDistribution(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    url: `${DISTRIBUTION_URL}${id}/`,
    method: "DELETE",
  });
}

export { createDistribution, getDistributions, deleteDistribution };
