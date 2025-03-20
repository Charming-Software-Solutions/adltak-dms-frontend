"use server";

import { ActivityLog } from "@/types/activityLog";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";

type ActivityLogFilters = {
  type?: string;
  role?: string;
  module?: string;
};

async function getActivityLogs(
  filters?: ActivityLogFilters,
): Promise<ActivityLog[]> {
  // NOTE: the query param keys (e.g. event_type) are based
  // off the backend

  // set search params for the url
  const queryParams = new URLSearchParams();
  if (filters?.type) {
    queryParams.append("event_type", filters.type);
  }
  if (filters?.role) {
    queryParams.append("user_role", filters.role);
  }
  if (filters?.module) {
    queryParams.append("model_name", filters.module);
  }

  // if query string exists then when update the url to have those filters
  // otherwise we retain the intial url
  const queryString = queryParams.toString();
  const url = queryString
    ? `${process.env.DOMAIN}/activity-log/?${queryString}`
    : `${process.env.DOMAIN}/activity-log/`;

  const session = await getSession();
  const response = await fetchAndHandleResponse<ActivityLog[]>({
    url,
    jwt: session?.access,
    method: "GET",
  });

  console.log(filters);
  console.log(response.data);
  return response.data ?? [];
}

export { getActivityLogs };
