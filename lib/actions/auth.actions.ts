"use server";

import { cookies } from "next/headers";
import { createSession, decryptSession, deleteSession } from "../auth";
import { fetchAndHandleResponse } from "../utils";
import { ErrorResponse } from "@/types/api";
import { User } from "@/types/user";

const authUrl = `${process.env.DOMAIN}/auth`;

async function login(formData: FormData): Promise<ErrorResponse> {
  const response = await fetchAndHandleResponse<User>({
    url: `${authUrl}/login/`,
    method: "POST",
    body: formData,
  });

  if (response.errors) {
    return response.errors;
  }

  if (!response.data) {
    return { general: ["User data is missing from the response"] };
  }

  await createSession(response.data);
}

async function logout() {
  const encryptedSession = cookies().get("session")?.value;

  if (!encryptedSession) {
    // Handle case where session cookie is missing or empty
    console.error("Session cookie not found or empty.");
    return;
  }

  const session = await decryptSession(encryptedSession);

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
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export { login, logout };
