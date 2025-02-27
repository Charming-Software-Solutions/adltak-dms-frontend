"use server";

import { ApiResponse } from "@/types/api";
import { Employee, UserLogin } from "@/types/user";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getSession } from "../session";
import { fetchAndHandleResponse } from "../utils";
import { getEmployeeProfile } from "./employee.actions";
import { formatErrorResponse } from "../formatters";

const authUrl = `${process.env.DOMAIN}/auth`;

async function login(email: string, password: string): Promise<UserLogin> {
  const response = await fetchAndHandleResponse<UserLogin>({
    url: `${authUrl}/login/`,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response || !response.data) {
    throw new Error(
      response.errors ? JSON.stringify(response.errors) : "Unknown error",
    );
  }
  const userDataLogin = response.data as UserLogin;

  await createSession(userDataLogin);

  return userDataLogin;
}

async function logout(refresh: string) {
  try {
    const response = await fetchAndHandleResponse<string>({
      url: `${authUrl}/logout/`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({
        refresh: refresh,
      }),
    });

    if (response.errors) {
      throw new Error("Logout failed.");
    }

    await deleteSession();
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

async function getAccountSession(): Promise<{
  employee: Employee;
  refresh: string;
}> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const employeeData = await getEmployeeProfile();
  if (employeeData.errors) {
    throw new Error("An error have occured.");
  }
  const employee = employeeData.data as Employee;
  const refresh = session.refresh;

  return { employee, refresh };
}

async function changeEmail(
  formData: FormData,
): Promise<ApiResponse<{ email: string }>> {
  return fetchAndHandleResponse({
    url: `${authUrl}/change-email/`,
    jwt: (await getSession())?.access,
    method: "PUT",
    body: formData,
  });
}

async function changePassword(
  formData: FormData,
): Promise<ApiResponse<{ message: string }>> {
  return fetchAndHandleResponse({
    url: `${authUrl}/change-password/`,
    jwt: (await getSession())?.access,
    method: "PUT",
    body: formData,
  });
}

async function sendPasswordResetLink(
  email: string,
): Promise<ApiResponse<{ message: string }>> {
  return fetchAndHandleResponse({
    url: `${authUrl}/send-password-reset-link/`,
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
    contentType: "application/json",
  });
}

async function resetPassword(
  formData: FormData,
  token: string,
): Promise<ApiResponse<{ message: string }>> {
  return fetchAndHandleResponse({
    url: `${authUrl}/reset-password/${token}/`,
    method: "POST",
    body: formData,
  });
}

async function validateResetPasswordToken(
  token: string,
): Promise<ApiResponse<{ message: string }>> {
  return fetchAndHandleResponse({
    url: `${authUrl}/validate-reset-password-token/`,
    method: "POST",
    body: JSON.stringify({
      token: token,
    }),
    contentType: "application/json",
  });
}

export {
  changeEmail,
  changePassword,
  getAccountSession,
  login,
  logout,
  sendPasswordResetLink,
  resetPassword,
  validateResetPasswordToken,
};
