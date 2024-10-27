"use server";

import { ErrorResponse } from "@/types/api";
import { UserLogin } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, decrypt, deleteSession } from "../session";
import { fetchAndHandleResponse } from "../utils";

const authUrl = `${process.env.DOMAIN}/auth`;

async function login(formData: FormData): Promise<ErrorResponse | null> {
  const response = await fetchAndHandleResponse<UserLogin>({
    url: `${authUrl}/login/`,
    method: "POST",
    body: formData,
  });

  const refresh = response.data?.refresh;
  const access = response.data?.access;
  const userId = response.data?.user;

  // Check if any required values are null
  if (response.data) {
    if (!access || !refresh || !userId) {
      // Handle the case where one of the values is null
      throw new Error(
        "Missing session data: access, refresh, or userId is null.",
      );
    }

    await createSession(access, refresh, userId);
    redirect("/");
  } else {
    return response.errors;
  }
}

async function logout() {
  const encryptedSession = cookies().get("session")?.value;

  if (!encryptedSession) {
    // Handle case where session cookie is missing or empty
    console.error("Session cookie not found or empty.");
    return;
  }

  const session = await decrypt(encryptedSession);

  if (!session) {
    // Handle case where decryption fails
    console.error("Failed to decrypt session cookie.");
    return;
  }

  const refreshToken = session.refresh;

  try {
    const response = await fetchAndHandleResponse<string>({
      url: `${authUrl}/logout/`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (response.errors) {
      return response.errors;
    }

    await deleteSession();
    redirect("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export { login, logout };
