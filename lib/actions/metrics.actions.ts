"use server";

import { Metric } from "@/types/metrics";
import { getSession } from "../session";
import { fetchAndHandleResponse } from "../utils";

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

async function getMonthlyDistributionFlow(): Promise<number> {
  const response = await fetchAndHandleResponse<Metric>({
    url: `${METRICS_URL}/monthly-distribution-flow/`,
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

export {
  getTotalItemStock,
  getMonthlyDistributionFlow,
  getRemainingTaskCount,
  getProductsAboutToExpireCount,
};
