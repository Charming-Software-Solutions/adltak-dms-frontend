"use server";

import { UserLogin } from "@/types/user";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../session";
import { fetchAndHandleResponse } from "../utils";

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
    throw new Error("Login failed: no response or invalid data");
  }
  const userData = response.data as UserLogin;
  await createSession(userData);

  return userData;
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
    redirect("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export { login, logout };
