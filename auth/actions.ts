"use server";

import { fetchAndHandleResponse } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { SessionPayload } from "@/types/auth";
import { createSession, deleteSession, getSession } from "./session";

const authUrl = `${process.env.DOMAIN}/auth`;

async function login(email: string, password: string): Promise<SessionPayload> {
  const response = await fetchAndHandleResponse<SessionPayload>({
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

  const sessionPayload = response.data as SessionPayload;
  await createSession(sessionPayload);
  return sessionPayload;
}

async function logout() {
  try {
    const response = await fetchAndHandleResponse<string>({
      url: `${authUrl}/logout/`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({
        refresh: (await getSession())?.refresh,
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
  login,
  logout,
  sendPasswordResetLink,
  resetPassword,
  validateResetPasswordToken,
};
