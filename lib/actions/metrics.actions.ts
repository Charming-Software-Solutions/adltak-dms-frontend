"use server";

import { DistributionFlowComparison, Metric } from "@/types/metrics";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";

const METRICS_URL = `${process.env.DOMAIN}/metrics`;

function parseMetricValue(value: string | undefined): number {
  const parsedValue = value ? parseInt(value, 10) : 0;
  return isNaN(parsedValue) ? 0 : parsedValue;
}

async function getTotalItemStock(): Promise<number> {
  const response = await fetchAndHandleResponse<Metric>({
    url: `${METRICS_URL}/total-item-stock/`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
  return parseMetricValue(response.data?.value);
}

async function getMontlyProjects(): Promise<number> {
  const response = await fetchAndHandleResponse<Metric>({
    url: `${METRICS_URL}/monthly-project-count/`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
  return parseMetricValue(response.data?.value);
}

async function getRemainingTaskCount(): Promise<number> {
  const response = await fetchAndHandleResponse<Metric>({
    url: `${METRICS_URL}/remaining-task-count/`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
  return parseMetricValue(response.data?.value);
}

async function getProductsAboutToExpireCount(): Promise<number> {
  const response = await fetchAndHandleResponse<Metric>({
    url: `${METRICS_URL}/products-about-to-expire-count/`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
  return parseMetricValue(response.data?.value);
}

async function getProductsExpiredCount(): Promise<number> {
  const response = await fetchAndHandleResponse<Metric>({
    url: `${METRICS_URL}/products-expired-count/`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
  return parseMetricValue(response.data?.value);
}

async function getDistributionFlowComparison(): Promise<
  DistributionFlowComparison[]
> {
  const response = await fetchAndHandleResponse<DistributionFlowComparison[]>({
    url: `${METRICS_URL}/distribution-flow-comparison/`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
  return response.data ?? [];
}

export {
  getTotalItemStock,
  getMontlyProjects,
  getRemainingTaskCount,
  getProductsAboutToExpireCount,
  getProductsExpiredCount,
  getDistributionFlowComparison,
};
