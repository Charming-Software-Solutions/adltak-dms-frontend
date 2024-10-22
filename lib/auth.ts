import { User } from "@/types/user";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

type Session = {
  refresh: string;
  access: string;
  user: User;
};

const secret = new TextEncoder().encode(process.env.SECRET);
const loginUrl = "/auth/login";

const cookieConfig = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
  duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

export async function encryptSession(session: Session): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1day")
    .sign(secret);
}

export async function decryptSession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Session;
  } catch (error) {
    console.error("Failed to decrypt session token:", error);
    return null;
  }
}

export async function setSessionCookie(session: Session) {
  const expires = new Date(Date.now() + cookieConfig.duration);
  const encryptedSession = await encryptSession(session);

  cookies().set(cookieConfig.name, encryptedSession, {
    ...cookieConfig.options,
    expires,
  });
}

export function deleteSessionCookie() {
  cookies().delete(cookieConfig.name);
}

export async function createSession(data: any) {
  const session: Session = {
    refresh: data.refresh,
    access: data.access,
    user: data.user,
  };
  await setSessionCookie(session);
  redirect("/");
}

export async function deleteSession() {
  deleteSessionCookie();
  redirect(loginUrl);
}

export async function getSession(): Promise<Session> {
  const cookie = cookies().get("session")?.value;

  if (!cookie) {
    redirect("/login");
  }

  const session = await decryptSession(cookie);

  if (!session) {
    redirect("/login");
  }

  return session;
}
