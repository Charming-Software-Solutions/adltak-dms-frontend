import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import "server-only";
import { SessionPayload } from "@/types/auth";
import { User } from "@/types/user";

export async function createSession(sessionPayload: SessionPayload) {
  // TODO: adjust expiration time of access and refresh tokens in the
  // future
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  const { access: accessToken, refresh: refreshToken } = sessionPayload;

  // Set the access and refresh tokens as the same time in cookies
  cookieStore.set("access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access-token")?.value;
  const refresh = cookieStore.get("refresh-token")?.value;

  if (!access || !refresh) return null;

  const user = jwtDecode(access) as User;
  return { access, refresh, user };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("access-token");
  cookieStore.delete("refresh-token");
}
