import { User, UserLogin } from "@/types/user";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import "server-only";

type SessionPayload = {
  access: string;
  refresh: string;
  user: User;
  expiresAt: Date;
};

const secret = new TextEncoder().encode(process.env.SECRET);

const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userLogin: UserLogin) {
  const access = userLogin.access;
  const refresh = userLogin.refresh;
  const user = userLogin.user;

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION);
  const session = await encrypt({ access, refresh, user, expiresAt });

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = cookies().get("session")?.value;
  if (!cookie) {
    console.error("Session cookie not found.");
    return null;
  }
  const payload = await decrypt(cookie);
  if (!payload) {
    console.error(
      "Failed to decrypt session cookie or invalid payload format.",
    );
    return null;
  }

  return {
    access: payload.access,
    refresh: payload.refresh,
    user: payload.user,
    expiresAt: new Date(payload.expiresAt),
  };
}

export async function deleteSession() {
  cookies().delete("session");
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}
