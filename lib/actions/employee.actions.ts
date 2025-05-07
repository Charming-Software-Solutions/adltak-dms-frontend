"use server";

import { ApiResponse } from "@/types/api";
import { Employee } from "@/types/user";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";

const EMPLOYEE_URL = `${process.env.DOMAIN}/employee/`;

async function createEmployee(body: FormData): Promise<ApiResponse<Employee>> {
  return fetchAndHandleResponse({
    url: EMPLOYEE_URL,
    method: "POST",
    jwt: (await getSession())?.access,
    body: body,
  });
}

async function getEmployees(): Promise<Employee[]> {
  const response = await fetchAndHandleResponse<Employee[]>({
    url: EMPLOYEE_URL,
    method: "GET",
    jwt: (await getSession())?.access,
  });
  return response.data ?? [];
}

async function getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
  return fetchAndHandleResponse({
    url: `${EMPLOYEE_URL}${id}/`,
    method: "GET",
    jwt: (await getSession())?.access,
  });
}

async function getEmployeeProfile(): Promise<ApiResponse<Employee>> {
  return fetchAndHandleResponse({
    url: `${EMPLOYEE_URL}profile/`,
    method: "GET",
    jwt: (await getSession())?.access,
  });
}

async function updateEmployee(
  id: string,
  body: FormData,
): Promise<ApiResponse<Employee>> {
  return fetchAndHandleResponse({
    url: `${EMPLOYEE_URL}${id}/`,
    method: "PATCH",
    jwt: (await getSession())?.access,
    body: body,
  });
}

async function deleteEmployee(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    url: `${EMPLOYEE_URL}${id}/`,
    method: "DELETE",
    jwt: (await getSession())?.access,
  });
}

async function updateEmployeeProfile(
  formData: FormData,
): Promise<ApiResponse<Employee>> {
  return fetchAndHandleResponse({
    url: `${EMPLOYEE_URL}update-employee-profile/`,
    method: "PATCH",
    jwt: (await getSession())?.access,
    body: formData,
  });
}

async function getWarehousePersonnelByProject(
  projectName: string,
): Promise<Employee[]> {
  const response = await fetchAndHandleResponse<Employee[]>({
    url: `${EMPLOYEE_URL}warehouse-personnel-by-project/?project=${projectName}`,
    method: "GET",
    jwt: (await getSession())?.access,
  });
  return response.data ?? [];
}

export {
  createEmployee,
  deleteEmployee,
  getEmployeeProfile,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeProfile,
  getWarehousePersonnelByProject,
};
